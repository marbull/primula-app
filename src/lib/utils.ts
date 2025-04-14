// src/lib/utils.ts

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// リップルエフェクト用の関数
export function createRippleEffect(event: React.MouseEvent<HTMLElement>) {
  // モーション軽減が有効な場合はエフェクトをスキップ
  if (prefersReducedMotion()) {
    return;
  }

  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  ripple.className = 'ripple-effect';
  button.querySelector('.ripple-container')?.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600); // アニメーション完了後に要素を削除
}

// モーション軽減の設定を取得するユーティリティ
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// 高コントラストモードの設定を取得するユーティリティ
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: more)').matches || 
         window.matchMedia('(prefers-contrast: high)').matches;
}

// フォーカス管理用のユーティリティ
export function manageFocus(focusElement: HTMLElement | null, restoreFocus: boolean = true): () => void {
  if (!focusElement) return () => {};
  
  const previouslyFocused = document.activeElement as HTMLElement;
  
  // 新しい要素にフォーカスを移動
  focusElement.focus();
  
  // フォーカスを元に戻す関数を返す
  return () => {
    if (restoreFocus && previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };
}

// キーボードイベントハンドラー
export function handleKeyboardEvent(
  event: React.KeyboardEvent,
  actions: Record<string, () => void>,
  preventDefault: boolean = true
) {
  const key = event.key.toLowerCase();
  
  if (actions[key]) {
    if (preventDefault) {
      event.preventDefault();
    }
    actions[key]();
  }
}
