import { useState } from 'react';

export type Page = 'index' | 'about' | 'attractions' | 'manage' | 'form' | 'detail';

export interface RouterParams {
  mode?: 'add' | 'edit';
  id?: number;
}

export function useRouter() {
  const [currentPage, setCurrentPage] = useState<Page>('index');
  const [params, setParams] = useState<RouterParams>({});

  const navigate = (page: Page, newParams: RouterParams = {}) => {
    setCurrentPage(page);
    setParams(newParams);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return {
    currentPage,
    params,
    navigate
  };
}
