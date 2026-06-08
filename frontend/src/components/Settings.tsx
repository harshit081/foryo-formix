import React from 'react';
import { Shield, CheckCircle, XCircle, Key, RefreshCw } from 'lucide-react';

interface SettingsProps {
  clientIdLoaded: boolean;
  backendHealthy: boolean;
  onCheckHealth: () => void;
  clientId: string;
}

export default function Settings({ 
  clientIdLoaded, 
  backendHealthy, 
  onCheckHealth, 
  clientId 
}: SettingsProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="theme-card p-7">
        <h2 className="text-xl font-bold font-display text-theme-text-main mb-4 flex items-center gap-2">
          <Shield size={20} className="text-theme-primary" />
          <span>Application Configuration</span>
        </h2>
        <p className="text-theme-text-muted text-sm mb-6">
          Verify connection status between your browser, backend server, and the Google APIs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Backend Health Status */}
          <div className="theme-card p-4 flex items-center gap-4 bg-white/2">
            {backendHealthy ? (
              <CheckCircle size={28} className="text-theme-success" />
            ) : (
              <XCircle size={28} className="text-theme-danger" />
            )}
            <div>
              <div className="font-semibold text-sm text-theme-text-main">Backend Server Connection</div>
              <div className="text-theme-text-muted text-xs">
                {backendHealthy ? 'Online (http://localhost:5000)' : 'Offline or unreachable'}
              </div>
            </div>
            <button 
              className="theme-btn-secondary p-2 ml-auto rounded cursor-pointer" 
              onClick={onCheckHealth}
              title="Refresh connection"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Client ID Status */}
          <div className="theme-card p-4 flex items-center gap-4 bg-white/2">
            {clientIdLoaded ? (
              <CheckCircle size={28} className="text-theme-success" />
            ) : (
              <XCircle size={28} className="text-theme-danger" />
            )}
            <div>
              <div className="font-semibold text-sm text-theme-text-main">Google Client ID</div>
              <div className="text-theme-text-muted text-xs">
                {clientIdLoaded ? `Loaded: ${clientId.substring(0, 15)}...` : 'Not loaded from backend .env'}
              </div>
            </div>
          </div>
        </div>

        {clientIdLoaded && backendHealthy && (
          <div className="p-4 bg-theme-success/10 border border-theme-success rounded-lg text-sm text-theme-text-main flex items-center gap-3">
            <CheckCircle size={18} className="text-theme-success" />
            <span>Success! The backend is configured. You can now connect your Google account via the button on the left.</span>
          </div>
        )}
      </div>

      <div className="theme-card p-7">
        <h3 className="text-lg font-bold font-display text-theme-text-main mb-4 flex items-center gap-2">
          <Key size={18} className="text-theme-warning" />
          <span>OAuth credentials Setup Guide</span>
        </h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">1</div>
            <div className="text-xs text-theme-text-muted leading-relaxed">
              Open the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline text-theme-primary hover:text-theme-primary-hover">Google Cloud Console</a>.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">2</div>
            <div className="text-xs text-theme-text-muted leading-relaxed">
              Create a new Google Cloud project (or choose an existing one) and navigate to the <strong>API Library</strong>. Search for and enable the <strong>Google Forms API</strong>.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">3</div>
            <div className="text-xs text-theme-text-muted leading-relaxed">
              Navigate to <strong>APIs & Services &gt; OAuth consent screen</strong>. Configure it as <strong>External</strong> and add scope <code>.../auth/forms.body</code> and <code>.../auth/forms.responses.readonly</code>. Add your own email as a Test User.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">4</div>
            <div className="text-xs text-theme-text-muted leading-relaxed">
              Go to <strong>Credentials</strong>. Click <strong>+ Create Credentials &gt; OAuth Client ID</strong>. Select <strong>Web application</strong> as the application type.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">5</div>
            <div className="text-xs text-theme-text-muted leading-relaxed">
              Under <strong>Authorized JavaScript origins</strong>, add <code>http://localhost:3000</code>.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">6</div>
            <div className="text-xs text-theme-text-muted leading-relaxed">
              Click <strong>Create</strong>. Copy the generated <strong>Client ID</strong> and <strong>Client Secret</strong>.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">7</div>
            <div className="text-xs text-theme-text-muted leading-relaxed w-full">
              Paste these details in the backend <code>.env</code> file under variables:
              <pre className="bg-black/20 p-3 rounded mt-2 font-mono text-xs text-theme-text-main overflow-x-auto w-full">
                GOOGLE_CLIENT_ID="[Your Client ID]"<br />
                GOOGLE_CLIENT_SECRET="[Your Client Secret]"
              </pre>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">8</div>
            <div className="text-xs text-theme-text-muted leading-relaxed">
              Restart your Express backend server to load the new credentials. Once done, verify the status displays "Loaded" above and connect your Google account!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
