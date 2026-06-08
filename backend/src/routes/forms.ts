import { Router } from 'express';
import { google } from 'googleapis';
import prisma from '../db';
import { authenticateToken, AuthenticatedRequest, getGoogleOAuthClient } from '../utils/oauth';

const router = Router();

// Get all forms created by the user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const forms = await prisma.form.findMany({
      where: { userId: req.userId },
      include: { questions: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(forms);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve forms', details: error.message });
  }
});

// Get a single form details
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  try {
    const form = await prisma.form.findFirst({
      where: { id, userId: req.userId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve form', details: error.message });
  }
});

// Create/save a new form structure locally
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { title, description, isQuiz, questions } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Form title is required' });
  }

  try {
    const newForm = await prisma.$transaction(async (tx: any) => {
      const form = await tx.form.create({
        data: {
          title,
          description,
          isQuiz: isQuiz || false,
          userId: req.userId!,
        },
      });

      if (questions && Array.isArray(questions)) {
        await Promise.all(
          questions.map((q: any, idx: number) =>
            tx.question.create({
              data: {
                formId: form.id,
                title: q.title,
                type: q.type,
                options: q.options ? (typeof q.options === 'string' ? q.options : JSON.stringify(q.options)) : null,
                required: q.required || false,
                points: q.points || 0,
                correctAnswers: q.correctAnswers ? (typeof q.correctAnswers === 'string' ? q.correctAnswers : JSON.stringify(q.correctAnswers)) : null,
                order: idx,
              },
            })
          )
        );
      }

      return tx.form.findUnique({
        where: { id: form.id },
        include: { questions: true },
      });
    });

    res.json(newForm);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create form', details: error.message });
  }
});

// Update/Edit a form structure locally
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, isQuiz, questions } = req.body;

  try {
    // Verify ownership
    const existingForm = await prisma.form.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const updatedForm = await prisma.$transaction(async (tx: any) => {
      // Update form meta
      const form = await tx.form.update({
        where: { id },
        data: {
          title: title ?? existingForm.title,
          description: description ?? existingForm.description,
          isQuiz: isQuiz !== undefined ? isQuiz : existingForm.isQuiz,
        },
      });

      // If questions provided, replace them
      if (questions && Array.isArray(questions)) {
        await tx.question.deleteMany({
          where: { formId: id },
        });

        await Promise.all(
          questions.map((q: any, idx: number) =>
            tx.question.create({
              data: {
                formId: id,
                title: q.title,
                type: q.type,
                options: q.options ? (typeof q.options === 'string' ? q.options : JSON.stringify(q.options)) : null,
                required: q.required || false,
                points: q.points || 0,
                correctAnswers: q.correctAnswers ? (typeof q.correctAnswers === 'string' ? q.correctAnswers : JSON.stringify(q.correctAnswers)) : null,
                order: idx,
              },
            })
          )
        );
      }

      return tx.form.findUnique({
        where: { id },
        include: { questions: { orderBy: { order: 'asc' } } },
      });
    });

    res.json(updatedForm);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update form', details: error.message });
  }
});

// Delete a form locally (optionally trashing from Google Drive)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const deleteFromDrive = req.query.deleteFromDrive === 'true';

  try {
    const existingForm = await prisma.form.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (deleteFromDrive && existingForm.googleFormId) {
      try {
        const oauthClient = await getGoogleOAuthClient(req.userId!);
        const drive = google.drive({ version: 'v3', auth: oauthClient });
        
        await drive.files.update({
          fileId: existingForm.googleFormId,
          requestBody: {
            trashed: true,
          },
        });
      } catch (driveErr: any) {
        console.error('Google Drive Trash Error:', driveErr);
        // If file is not found (404), it's already deleted from Drive, so we can proceed.
        // Otherwise, throw an error to prevent deleting locally if Drive update failed.
        if (driveErr.status !== 404 && driveErr.code !== 404) {
          return res.status(500).json({
            error: 'Failed to trash form on Google Drive. Please check your permissions or re-authenticate.',
            details: driveErr.message
          });
        }
      }
    }

    await prisma.form.delete({
      where: { id },
    });

    res.json({ message: 'Form deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete form', details: error.message });
  }
});

// Export a local form configuration to live Google Forms API
router.post('/:id/export', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  try {
    const form = await prisma.form.findFirst({
      where: { id, userId: req.userId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Get authorized Google client for this user
    const oauthClient = await getGoogleOAuthClient(req.userId!);
    const googleForms = google.forms({ version: 'v1', auth: oauthClient });

    // Step 1: Create the form shell (API allows ONLY title during create)
    const createRes = await googleForms.forms.create({
      requestBody: {
        info: {
          title: form.title,
        },
      },
    });

    const googleFormId = createRes.data.formId;
    const googleResponderUri = createRes.data.responderUri;

    if (!googleFormId) {
      return res.status(500).json({ error: 'Failed to create Google Form shell' });
    }

    // Step 2: Build updates list for questions and settings
    const requests: any[] = [];

    // If description is provided, update it via batchUpdate
    if (form.description) {
      requests.push({
        updateFormInfo: {
          info: {
            description: form.description,
          },
          updateMask: 'description',
        },
      });
    }

    // If quiz mode is enabled, configure form settings
    if (form.isQuiz) {
      requests.push({
        updateSettings: {
          settings: {
            quizSettings: {
              isQuiz: true,
            },
          },
          updateMask: 'quizSettings.isQuiz',
        },
      });
    }

    const questionRequests = form.questions.map((q: any, idx: number) => {
      const baseItem: any = {
        title: q.title,
        questionItem: {
          question: {
            required: q.required,
          },
        },
      };

      // Set specific question structures
      if (q.type === 'TEXT') {
        baseItem.questionItem.question.textQuestion = {};
      } else if (q.type === 'PARAGRAPH') {
        baseItem.questionItem.question.textQuestion = { paragraph: true };
      } else {
        // Choice questions: Radio, Checkbox, Dropdown
        const optionsList = q.options ? JSON.parse(q.options) : [];
        const choiceOptions = optionsList.map((opt: string) => ({ value: opt }));
        
        let choiceType = 'RADIO';
        if (q.type === 'CHECKBOXES') choiceType = 'CHECKBOX';
        if (q.type === 'DROPDOWN') choiceType = 'DROP_DOWN';

        baseItem.questionItem.question.choiceQuestion = {
          type: choiceType,
          options: choiceOptions,
        };
      }

      // Attach grading settings for quiz mode
      if (form.isQuiz && (q.points > 0 || q.correctAnswers)) {
        let correctAnswersList: string[] = [];
        if (q.correctAnswers) {
          try {
            correctAnswersList = JSON.parse(q.correctAnswers);
          } catch (e) {
            correctAnswersList = [q.correctAnswers];
          }
        }
        
        baseItem.questionItem.question.grading = {
          pointValue: q.points,
          correctAnswers: {
            answers: correctAnswersList.map((ans: string) => ({ value: ans })),
          },
        };
      }

      return {
        createItem: {
          item: baseItem,
          location: {
            index: idx,
          },
        },
      };
    });

    requests.push(...questionRequests);

    // Step 3: Send updates to Google Forms API
    if (requests.length > 0) {
      await googleForms.forms.batchUpdate({
        formId: googleFormId,
        requestBody: {
          requests,
        },
      });
    }

    // Step 4: Update the form record in local database
    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        googleFormId,
        googleResponderUri,
      },
      include: { questions: true },
    });

    res.json(updatedForm);
  } catch (error: any) {
    console.error('Google Forms Export Error:', error);
    res.status(500).json({ error: 'Failed to export to Google Forms', details: error.message });
  }
});

// Fetch responses and compute metrics/analytics from Google Forms
router.get('/:id/analytics', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  try {
    const form = await prisma.form.findFirst({
      where: { id, userId: req.userId },
      include: { questions: true },
    });

    if (!form || !form.googleFormId) {
      return res.status(404).json({ error: 'Exported Google Form not found for this record' });
    }

    const oauthClient = await getGoogleOAuthClient(req.userId!);
    const googleForms = google.forms({ version: 'v1', auth: oauthClient });

    // 1. Get Google Form structure to map Question IDs to Titles
    const formMeta = await googleForms.forms.get({
      formId: form.googleFormId,
    });

    // Create mapping: Google Question ID -> Question Details (Title, Type, Options)
    const googleToLocalMap: { [key: string]: { title: string; type: string; options: string[] } } = {};
    
    formMeta.data.items?.forEach(item => {
      const qId = item.questionItem?.question?.questionId;
      if (qId && item.title) {
        let qType = 'TEXT';
        let options: string[] = [];

        if (item.questionItem?.question?.choiceQuestion) {
          const choiceQ = item.questionItem.question.choiceQuestion;
          qType = choiceQ.type === 'CHECKBOX' ? 'CHECKBOXES' : (choiceQ.type === 'DROP_DOWN' ? 'DROPDOWN' : 'MULTIPLE_CHOICE');
          options = choiceQ.options?.map(o => o.value || '').filter(Boolean) || [];
        } else if (item.questionItem?.question?.textQuestion?.paragraph) {
          qType = 'PARAGRAPH';
        }

        googleToLocalMap[qId] = {
          title: item.title,
          type: qType,
          options,
        };
      }
    });

    // 2. Fetch responses list
    let responsesRes;
    try {
      responsesRes = await googleForms.forms.responses.list({
        formId: form.googleFormId,
      });
    } catch (err: any) {
      // If no responses have been submitted yet, it can return empty or 404/error in some API versions
      if (err.status === 404 || err.message?.includes('not found')) {
        return res.json({ responseCount: 0, responses: [], questionStats: {} });
      }
      throw err;
    }

    const rawResponses = responsesRes.data.responses || [];

    // 3. Transform and map answers
    const processedResponses = rawResponses.map(resp => {
      const answers: { [key: string]: { questionTitle: string; answerText: string[] } } = {};
      
      if (resp.answers) {
        Object.entries(resp.answers).forEach(([qId, ansObj]: [string, any]) => {
          const mappedQ = googleToLocalMap[qId];
          const questionTitle = mappedQ ? mappedQ.title : `Question (${qId})`;
          
          let answerText: string[] = [];
          if (ansObj.textAnswers?.answers) {
            answerText = ansObj.textAnswers.answers.map((a: any) => a.value || '').filter(Boolean);
          }

          answers[qId] = {
            questionTitle,
            answerText,
          };
        });
      }

      return {
        responseId: resp.responseId,
        createTime: resp.createTime,
        lastSubmittedTime: resp.lastSubmittedTime,
        respondentEmail: resp.respondentEmail || 'Anonymous',
        answers,
      };
    });

    // 4. Calculate aggregated metrics per question
    const questionStats: { [key: string]: { title: string; type: string; totalAnswers: number; optionCounts?: { [key: string]: number }; textSample?: string[] } } = {};
    
    // Initialize stats structure for questions we know from local/Google meta
    Object.entries(googleToLocalMap).forEach(([qId, qInfo]) => {
      questionStats[qId] = {
        title: qInfo.title,
        type: qInfo.type,
        totalAnswers: 0,
        ...(qInfo.options.length > 0 && {
          optionCounts: qInfo.options.reduce((acc, opt) => ({ ...acc, [opt]: 0 }), {}),
        }),
        ...((qInfo.type === 'TEXT' || qInfo.type === 'PARAGRAPH') && {
          textSample: [],
        }),
      };
    });

    // Aggregate response data
    processedResponses.forEach(resp => {
      Object.entries(resp.answers).forEach(([qId, ansDetails]) => {
        const stats = questionStats[qId];
        if (stats) {
          stats.totalAnswers += 1;
          
          if (stats.optionCounts) {
            ansDetails.answerText.forEach(val => {
              if (stats.optionCounts![val] !== undefined) {
                stats.optionCounts![val] += 1;
              } else {
                // Option not in predefined list (e.g. customized or 'Other')
                stats.optionCounts![val] = 1;
              }
            });
          }

          if (stats.textSample && ansDetails.answerText.length > 0) {
            stats.textSample.push(ansDetails.answerText.join(', '));
          }
        }
      });
    });

    res.json({
      responseCount: processedResponses.length,
      responses: processedResponses,
      questionStats,
    });
  } catch (error: any) {
    console.error('Google Forms Responses Fetch Error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics', details: error.message });
  }
});

// Helper to extract Form ID from URL
const extractFormId = (input: string): string => {
  const trimmed = input.trim();
  const idMatch = trimmed.match(/\/forms\/d\/(?:e\/)?([a-zA-Z0-9-_]+)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }
  return trimmed;
};

// Endpoint to import an existing form from Google Forms API
router.post('/import', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { googleFormUrlOrId } = req.body;
  if (!googleFormUrlOrId) {
    return res.status(400).json({ error: 'Google Form URL or ID is required' });
  }

  const googleFormId = extractFormId(googleFormUrlOrId);

  try {
    const oauthClient = await getGoogleOAuthClient(req.userId!);
    const googleForms = google.forms({ version: 'v1', auth: oauthClient });

    // 1. Fetch form structure from Google API
    const formRes = await googleForms.forms.get({
      formId: googleFormId,
    });

    const googleForm = formRes.data;
    const title = googleForm.info?.title || 'Imported Form';
    const description = googleForm.info?.description || null;
    const isQuiz = googleForm.settings?.quizSettings?.isQuiz || false;

    // 2. Map Google Form items to local Questions schema
    const questionsToCreate: any[] = [];
    let orderIndex = 0;

    googleForm.items?.forEach((item: any) => {
      if (item.questionItem?.question) {
        const qObj = item.questionItem.question;
        const qTitle = item.title || 'Question';
        const required = qObj.required || false;
        const points = qObj.grading?.pointValue || 0;
        
        let correctAnswers: string[] | null = null;
        if (qObj.grading?.correctAnswers?.answers) {
          correctAnswers = qObj.grading.correctAnswers.answers
            .map((ans: any) => ans.value)
            .filter(Boolean);
        }

        let type = 'TEXT';
        let options: string[] | null = null;

        if (qObj.choiceQuestion) {
          const choice = qObj.choiceQuestion;
          if (choice.type === 'CHECKBOX') type = 'CHECKBOXES';
          else if (choice.type === 'DROP_DOWN') type = 'DROPDOWN';
          else type = 'MULTIPLE_CHOICE';

          if (choice.options) {
            options = choice.options.map((opt: any) => opt.value).filter(Boolean);
          }
        } else if (qObj.textQuestion) {
          type = qObj.textQuestion.paragraph ? 'PARAGRAPH' : 'TEXT';
        }

        questionsToCreate.push({
          title: qTitle.trim(),
          type,
          options: options ? JSON.stringify(options) : null,
          required,
          points,
          correctAnswers: correctAnswers ? JSON.stringify(correctAnswers) : null,
          order: orderIndex++,
        });
      }
    });

    // 3. Save to database (Sync/Overwrite if exists, Create if new)
    const existingForm = await prisma.form.findFirst({
      where: { googleFormId, userId: req.userId },
    });

    const savedForm = await prisma.$transaction(async (tx: any) => {
      let form;
      if (existingForm) {
        // Delete old questions
        await tx.question.deleteMany({
          where: { formId: existingForm.id },
        });

        // Update form meta
        form = await tx.form.update({
          where: { id: existingForm.id },
          data: {
            title,
            description,
            isQuiz,
            googleResponderUri: googleForm.responderUri || existingForm.googleResponderUri,
          },
        });
      } else {
        // Create new form
        form = await tx.form.create({
          data: {
            title,
            description,
            googleFormId,
            googleResponderUri: googleForm.responderUri || null,
            isQuiz,
            userId: req.userId!,
          },
        });
      }

      // Re-create questions
      await Promise.all(
        questionsToCreate.map((q) =>
          tx.question.create({
            data: {
              formId: form.id,
              title: q.title,
              type: q.type,
              options: q.options,
              required: q.required,
              points: q.points,
              correctAnswers: q.correctAnswers,
              order: q.order,
            },
          })
        )
      );

      return tx.form.findUnique({
        where: { id: form.id },
        include: { questions: { orderBy: { order: 'asc' } } },
      });
    });

    res.json(savedForm);
  } catch (error: any) {
    console.error('Google Forms Import Error:', error);
    res.status(500).json({ error: 'Failed to import form from Google', details: error.message });
  }
});

export default router;
