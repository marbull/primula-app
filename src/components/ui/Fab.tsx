'use client';

import { cn, createRippleEffect, prefersHighContrast, handleKeyboardEvent } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode, useEffect, useState, useRef, KeyboardEvent } from 'react';

type FabSize = 'small' | 'medium' | 'large';
type FabVariant = 'regular' | 'primary' | 'secondary' | 'tertiary';

interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: FabSize;
  variant?: FabVariant;
  icon: ReactNode;
  extended?: boolean;
  label?: string;
  disableAnimation?: boolean; // アニメーションの無効化オプション
  controlsId?: string; // 制御する要素のID
  keyboardShortcut?: string; // キーボードショートカット
}

export const Fab = ({
  className,
  size = 'medium',
  variant = 'primary',
  icon,
  extended = false,
  label,
  disableAnimation = false,
  controlsId,
  keyboardShortcut,
  disabled,
  'aria-label': ariaLabel,
  ...props
}: FabProps) => {
  // 高コントラストモードの状態を管理
  const [isHighContrast, setIsHighContrast] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 高コントラストモードの検出
  useEffect(() => {
    // 初期値を設定
    setIsHighContrast(prefersHighContrast());

    // 変更を監視
    const mediaQuery = window.matchMedia('(prefers-contrast: more), (prefers-contrast: high)');
    const handleChange = () => setIsHighContrast(prefersHighContrast());
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // キーボードショートカットの処理
  useEffect(() => {
    if (!keyboardShortcut) return;

    const keys = keyboardShortcut.toLowerCase().split('+');
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // ユーザーが入力フィールドにフォーカスしている場合はスキップ
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      // ショートカットキーの条件をチェック
      const ctrlKey = keys.includes('ctrl') || keys.includes('control');
      const altKey = keys.includes('alt');
      const shiftKey = keys.includes('shift');
      const metaKey = keys.includes('meta') || keys.includes('cmd') || keys.includes('command');
      
      // 最後のキーはモディファイアではなく実際のキー
      const mainKey = keys.filter(k => !['ctrl', 'control', 'alt', 'shift', 'meta', 'cmd', 'command'].includes(k))[0];
      
      if (
        e.key.toLowerCase() === mainKey &&
        e.ctrlKey === ctrlKey &&
        e.altKey === altKey &&
        e.shiftKey === shiftKey &&
        e.metaKey === metaKey &&
        !disabled
      ) {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [keyboardShortcut, disabled]);

  // キーボードイベントハンドラー
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    // 元のonKeyDownがある場合は呼び出す
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }

    // Spaceキーでクリックと同じ効果を発生させる
    handleKeyboardEvent(e, {
      ' ': () => {
        if (!disabled && buttonRef.current) {
          buttonRef.current.click();
        }
      }
    });
  };

  // FABには必ずアクセシブルな名前が必要
  const accessibleName = ariaLabel || label || 'Action button';

  return (
    <button
      ref={buttonRef}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-all shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        variant === 'primary' && 'bg-primary text-on-primary hover:bg-primary-dark active:bg-primary-darker',
        variant === 'secondary' && 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container-dark active:bg-secondary-container-darker',
        variant === 'tertiary' && 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container-dark active:bg-tertiary-container-darker',
        variant === 'regular' && 'bg-surface text-primary hover:bg-surface-variant active:bg-surface-variant',
        // 高コントラストモードのスタイル
        isHighContrast && variant === 'primary' && 'bg-primary text-white border-2 border-black',
        isHighContrast && variant === 'secondary' && 'bg-gray-200 text-black border-2 border-black',
        isHighContrast && variant === 'tertiary' && 'bg-gray-300 text-black border-2 border-black',
        isHighContrast && variant === 'regular' && 'bg-white text-black border-2 border-black shadow-none',
        // 高コントラストモードでのフォーカス表示
        isHighContrast && 'focus-visible:ring-black focus-visible:ring-offset-0',
        size === 'small' && 'w-10 h-10',
        size === 'medium' && 'w-14 h-14',
        size === 'large' && 'w-24 h-24',
        extended && 'px-4 py-3 h-14 w-auto',
        disabled && 'opacity-50 cursor-not-allowed shadow-none',
        // モーション軽減またはアニメーション無効時
        (disableAnimation) && 'transition-none',
        className
      )}
      onClick={(e) => {
        if (!disabled && !disableAnimation) {
          createRippleEffect(e);
        }
        if (!disabled && props.onClick) {
          props.onClick(e);
        }
      }}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-disabled={disabled ? true : undefined}
      aria-label={accessibleName}
      aria-controls={controlsId}
      aria-keyshortcuts={keyboardShortcut}
      {...props}
    >
      <span className="ripple-container relative overflow-hidden flex items-center justify-center">
        <span aria-hidden={!!label || !!extended}>
          {icon}
        </span>
        {extended && label && (
          <span className="ml-2 font-medium">
            {label}
            {keyboardShortcut && (
              <span className="ml-2 text-xs opacity-70" aria-hidden="true">
                {keyboardShortcut.replace(/\+/g, ' + ').replace(/ctrl/i, 'Ctrl').replace(/alt/i, 'Alt').replace(/shift/i, 'Shift').replace(/meta|cmd|command/i, 'Cmd')}
              </span>
            )}
          </span>
        )}
      </span>
    </button>
  );
};