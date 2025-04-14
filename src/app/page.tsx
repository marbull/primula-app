'use client';

import { Button } from '@/components/ui/Button';
import { Fab } from '@/components/ui/Fab';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-4">🌸 Primula App 🌸</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        <div className="flex flex-col gap-3 items-center">
          <h2 className="text-lg font-medium">Filled</h2>
          <Button variant="filled" size="sm">Small Button</Button>
          <Button variant="filled" size="md">Medium Button</Button>
          <Button variant="filled" size="lg">Large Button</Button>
          <Button variant="filled" size="md" isLoading>Loading</Button>
          <Button variant="filled" size="md" disabled>Disabled</Button>
        </div>
        
        <div className="flex flex-col gap-3 items-center">
          <h2 className="text-lg font-medium">Outlined</h2>
          <Button variant="outlined" size="sm">Small Button</Button>
          <Button variant="outlined" size="md">Medium Button</Button>
          <Button variant="outlined" size="lg">Large Button</Button>
          <Button variant="outlined" size="md" isLoading>Loading</Button>
          <Button variant="outlined" size="md" disabled>Disabled</Button>
        </div>
        
        <div className="flex flex-col gap-3 items-center">
          <h2 className="text-lg font-medium">Text</h2>
          <Button variant="text" size="sm">Small Button</Button>
          <Button variant="text" size="md">Medium Button</Button>
          <Button variant="text" size="lg">Large Button</Button>
          <Button variant="text" size="md" isLoading>Loading</Button>
          <Button variant="text" size="md" disabled>Disabled</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-8">
        <div className="flex flex-col gap-3 items-center">
          <h2 className="text-lg font-medium">Elevated</h2>
          <Button variant="elevated" size="sm">Small Button</Button>
          <Button variant="elevated" size="md">Medium Button</Button>
          <Button variant="elevated" size="lg">Large Button</Button>
          <Button variant="elevated" size="md" isLoading>Loading</Button>
          <Button variant="elevated" size="md" disabled>Disabled</Button>
        </div>
        
        <div className="flex flex-col gap-3 items-center">
          <h2 className="text-lg font-medium">Tonal</h2>
          <Button variant="tonal" size="sm">Small Button</Button>
          <Button variant="tonal" size="md">Medium Button</Button>
          <Button variant="tonal" size="lg">Large Button</Button>
          <Button variant="tonal" size="md" isLoading>Loading</Button>
          <Button variant="tonal" size="md" disabled>Disabled</Button>
        </div>
      </div>
      
      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-lg font-medium text-center mb-3">Full Width Buttons</h2>
        <div className="flex flex-col gap-3">
          <Button variant="filled" fullWidth>Filled Full Width</Button>
          <Button variant="outlined" fullWidth>Outlined Full Width</Button>
          <Button variant="elevated" fullWidth>Elevated Full Width</Button>
          <Button variant="tonal" fullWidth>Tonal Full Width</Button>
        </div>
      </div>

      {/* アイコン付きボタンのセクションを追加 */}
      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-lg font-medium text-center mb-3">アイコン付きボタン</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 items-center">
            <h3 className="text-base font-medium">Start Icon</h3>
            <Button 
              variant="filled" 
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              }
            >
              お気に入り
            </Button>
            <Button 
              variant="outlined" 
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              }
            >
              追加
            </Button>
          </div>
          
          <div className="flex flex-col gap-3 items-center">
            <h3 className="text-base font-medium">End Icon</h3>
            <Button 
              variant="tonal" 
              endIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              }
            >
              次へ進む
            </Button>
            <Button 
              variant="text" 
              endIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              }
            >
              外部リンク
            </Button>
          </div>
        </div>
      </div>

      {/* FAB（Floating Action Button）セクションを追加 */}
      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-lg font-medium text-center mb-3">Floating Action Button (FAB)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3 items-center">
            <h3 className="text-base font-medium">サイズ</h3>
            <Fab 
              size="small"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              }
            />
            <Fab 
              size="medium"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              }
            />
          </div>
          
          <div className="flex flex-col gap-3 items-center">
            <h3 className="text-base font-medium">バリアント</h3>
            <Fab 
              variant="regular"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              }
            />
            <Fab 
              variant="secondary"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
              }
            />
          </div>
          
          <div className="flex flex-col gap-3 items-center">
            <h3 className="text-base font-medium">拡張タイプ</h3>
            <Fab 
              extended
              label="新規作成"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              }
            />
            <Fab 
              extended
              variant="secondary"
              label="編集"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* 固定FABの例 */}
      <div className="fixed bottom-8 right-8">
        <Fab 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          }
        />
      </div>
    </main>
  );
}
