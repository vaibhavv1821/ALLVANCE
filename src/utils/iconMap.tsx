import React from 'react';
import {
  Briefcase,
  Code2,
  FileText,
  Database,
  MessagesSquare,
  Calculator,
  Building2,
  FolderGit2,
  CalendarClock,
  BookMarked,
  Bot,
  BarChart3,
  Sparkles,
  UserCheck,
  Settings,
  Home,
  Grid,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Activity,
  Layers,
  LucideIcon,
} from 'lucide-react-native';

const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase,
  Code2,
  FileText,
  Database,
  MessagesSquare,
  Calculator,
  Building2,
  FolderGit2,
  CalendarClock,
  BookMarked,
  Bot,
  BarChart3,
  Sparkles,
  UserCheck,
  Settings,
  Home,
  Grid,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Activity,
  Layers,
};

export function getModuleIcon(name: string, color: string, size = 20): React.ReactNode {
  const IconComponent = ICON_MAP[name] || Layers;
  return <IconComponent size={size} color={color} />;
}
