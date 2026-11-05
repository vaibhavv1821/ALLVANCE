import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function InterviewsScreen() {
  return (
    <ModuleScreenLayout
      id="interviews"
      title="Interview Preparation"
      subtitle="Technical Rounds, System Design & Behavioral STAR"
      iconName="MessagesSquare"
      accentColor="#EC4899"
      description="Prepare for technical, system design, and managerial interview rounds with STAR method behavioral templates, CS core subject revision, and real interview logs."
      highlights={[
        {
          title: 'STAR Behavioral Framework',
          desc: 'Structure stories for leadership principles, conflict resolution, and technical challenges.',
        },
        {
          title: 'Core CS Foundations',
          desc: 'Operating Systems (processes, threads, deadlocks), Computer Networks (TCP/IP, HTTP), and DBMS.',
        },
        {
          title: 'Post-Interview Debriefs',
          desc: 'Record what went well, questions asked, and areas to improve after every round.',
        },
      ]}
      showBack={true}
    />
  );
}
