import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InventoryJob } from '@/api/entities';
import { InventoryItem } from '@/api/entities';
import { User } from '@/api/entities';

import JobCard from '../components/jobs/JobCard';
import CreateJobModal from '../components/jobs/CreateJobModal';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadJobs();
    loadCurrentUser();
  }, []);

  const loadJobs = async () => {
    const fetchedJobs = await InventoryJob.list('-created_date');
    setJobs(fetchedJobs);
  };

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const handleCreateJob = async (jobData) => {
    const newJob = await InventoryJob.create({
      ...jobData,
      assigned_to: currentUser?.email,
      supervisor: currentUser?.email
    });
    setJobs(prev => [newJob, ...prev]);
    setShowCreateModal(false);
  };

  const activeJobs = jobs.filter(job => job.job_status === 'active');
  const inProgressJobs = jobs.filter(job => job.job_status === 'in_progress');
  const completedJobs = jobs.filter(job => job.job_status === 'completed');

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Active Jobs
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage inventory projects and assign team members
            </p>
          </div>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{activeJobs.length}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Active Jobs</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{inProgressJobs.length}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">In Progress</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{completedJobs.length}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Completed</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {jobs.filter(job => job.priority === 'urgent').length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Urgent</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jobs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onUpdate={loadJobs}
            />
          ))}
        </motion.div>

        {jobs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              No Jobs Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first inventory job to get started
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Job
            </Button>
          </div>
        )}
      </div>

      <CreateJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateJob}
      />
    </div>
  );
}