import React from 'react';
import AutonomousAgentDashboard from '../components/ai/AutonomousAgentDashboard';

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <AutonomousAgentDashboard />
      </div>
    </div>
  );
}