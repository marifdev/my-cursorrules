export interface Rule {
  id: string;
  name: string;
  content: string;
  author: {
    name: string;
    contactUrl: string;
    avatarUrl: string;
  };
  categories: string[];
  createdAt: Date;
}

export interface RuleSubmission {
  content: string;
  authorName: string;
  contactUrl: string;
  avatarUrl: string;
  categories: string[];
} 