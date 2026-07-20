import React from 'react';
import { Share2, Linkedin, Github, Globe, Twitter } from 'lucide-react';
import { Input } from '../common/Input';

export const SocialLinksCard = ({ register, errors }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs transition-colors duration-200 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <Share2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-base">Social Links</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LinkedIn */}
        <div className="relative">
          <Input
            label="LinkedIn Profile"
            placeholder="https://linkedin.com/in/username"
            error={errors?.linkedin?.message}
            className="pl-0"
            {...register('linkedin')}
          />
          <Linkedin className="absolute right-3 top-[38px] h-4 w-4 text-slate-400" />
        </div>

        {/* GitHub */}
        <div className="relative">
          <Input
            label="GitHub Profile"
            placeholder="https://github.com/username"
            error={errors?.github?.message}
            {...register('github')}
          />
          <Github className="absolute right-3 top-[38px] h-4 w-4 text-slate-400" />
        </div>

        {/* Portfolio Website */}
        <div className="relative">
          <Input
            label="Portfolio Website"
            placeholder="https://username.dev or https://myportfolio.com"
            error={errors?.portfolio?.message}
            {...register('portfolio')}
          />
          <Globe className="absolute right-3 top-[38px] h-4 w-4 text-slate-400" />
        </div>

        {/* Twitter / X */}
        <div className="relative">
          <Input
            label="Twitter / X"
            placeholder="https://x.com/username"
            error={errors?.twitter?.message}
            {...register('twitter')}
          />
          <Twitter className="absolute right-3 top-[38px] h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
