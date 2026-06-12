import React from 'react';

export default function LandingTestimonials() {
  return (
    <section className="py-24 bg-white border-t border-zinc-200/60 z-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 shadow-md text-left flex flex-col justify-between">
            <p className="text-xs text-zinc-600 font-medium italic mb-6 leading-relaxed">"Foryo Formix completely changed how we handle customer feedback. It's no longer just data in a table, but a living workflow."</p>
            <div className="flex items-center gap-4 border-t border-zinc-200/50 pt-4">
              <img alt="Sarah Chen" className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL9AW9GWf-jNf2rIAvdnlytH2KDFncLMCwrj0ypC6cK8h8J9Wbjbb-UxihvEkoSTNxLsVju1XGz8VURo8PHF99FUHVtEwML6RKEyRsZGEQm0oq_tRAiQQopMRgtx4PVse0fqJs7tZHhauh8yIM_kscPXdKuVIp5Odc_JQR8sFB9Ul1nOo2ul27AMINPPl6kdzCu1W0lr1XGEqFcFA7JT8groM3NhZLdb1M6JYxW48C9lE9cnd6dY5o0jwSHiZ0D8yE0Tqp7O-4IAE"/>
              <div>
                <p className="text-xs font-extrabold text-[#111827] font-display">Sarah Chen</p>
                <p className="text-[10px] text-zinc-400 font-bold">Product Lead, TechFlow</p>
              </div>
            </div>
          </div>
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 shadow-md text-left flex flex-col justify-between md:translate-y-4">
            <p className="text-xs text-zinc-600 font-medium italic mb-6 leading-relaxed">"The analytics are breathtaking. We finally understand the 'why' behind our completion rates. The interface is just a joy to use."</p>
            <div className="flex items-center gap-4 border-t border-zinc-200/50 pt-4">
              <img alt="David Marcus" className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnjLGgIKRhfk451Tuz4061d1YObw-4W8dGm0U4ZAJCK_OXHy7pQwT4n655ZVcv3yjCkBZlu8EIzK4JLrRFMQXksIcp-Zk9GL9IrbsuNzDqT5VREtzMfMQiT5nj8qGQKdapSENrnY-FTrNCZYbsZKHYsHkjV00C5IEEyrHFL3vA9NxEx9G4TVZ0_T6T3_btIGZBHX4AEtSNk83DXBdQQFX4WCx4tp7mevDkQC4VBobIu3vaim6pS88VRiC-MzcrZim8bOntD6rYme4"/>
              <div>
                <p className="text-xs font-extrabold text-[#111827] font-display">David Marcus</p>
                <p className="text-[10px] text-zinc-400 font-bold">CTO, Nexus Corp</p>
              </div>
            </div>
          </div>
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 shadow-md text-left flex flex-col justify-between">
            <p className="text-xs text-zinc-600 font-medium italic mb-6 leading-relaxed">"Automations that actually work. We've cut response processing time by 60% using the node-based workflow builder."</p>
            <div className="flex items-center gap-4 border-t border-zinc-200/50 pt-4">
              <img alt="Alex Rivera" className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB-rSmkukaZ-hHHEqj0qP8Vke1AAp5bYmtoQeHt4Fq-KyGwg3TinJls6HYtUzXE6Yxtkcm3LElqL1a0qyWeUCcEA-nDZMhRWkRWqtD4neQm3M1uLqAz7NJ1nB0AeiaZ4Qyoi5MnQgcGmT-u1fTxFdMVDT4H6SciAhoPO2HuOde3L5lMCyfJE6zC_ZOqlU8q05jBCt538qgq9yEiRDz-al1zYeNBzzdogeqpg0QQ9AQ72Tozj6Yc6UOgQKTLBjkxNwLka7oIrLBkKU"/>
              <div>
                <p className="text-xs font-extrabold text-[#111827] font-display">Alex Rivera</p>
                <p className="text-[10px] text-zinc-400 font-bold">Operations Director, Swiftly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
