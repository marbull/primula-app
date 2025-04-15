'use client';

import { cn, createRippleEffect, prefersHighContrast, handleKeyboardEvent } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode, useEffect, useState, useRef, KeyboardEvent } from 'react';

/**
 * Buttonコンポーネント - Material Design 3に準拠したボタン
 * 
 * このコンポーネントは以下の機能を提供します：
 * - 5種類のバリアント: filled, outlined, text, elevated, tonal
 * - 3種類のサイズ: sm, md, lg
 * - アイコンサポート（startIcon, endIcon）
 * - キーボードショートカットのサポート
 * - 高コントラストモードへの対応
 * - アクセシビリティに配慮した実装
 * 
 * アクセシビリティの特徴:
 * - WAI-ARIA属性を適切に実装
 * - キーボード操作のサポート
 * - スクリーンリーダー対応
 * - 状態変化の通知
 */

/** Buttonのバリアントとサイズの型定義 */
type Variant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
type Size = 'sm' | 'md' | 'lg';

/**
 * Buttonコンポーネントのプロパティ定義
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのスタイルバリアント */
  variant?: Variant;
  /** ボタンのサイズ */
  size?: Size;
  /** ローディング状態を表示するかどうか */
  isLoading?: boolean;
  /** ボタンを幅いっぱいに表示するかどうか */
  fullWidth?: boolean;
  /** ボタンの先頭に表示するアイコン */
  startIcon?: ReactNode;
  /** ボタンの末尾に表示するアイコン */
  endIcon?: ReactNode;
  /** アイコンのみのボタンかどうか（アクセシビリティのためaria-labelの設定が必要） */
  iconOnly?: boolean;
  /** トグルボタンの場合の押下状態 */
  pressed?: boolean;
  /** 展開可能なメニューなどの場合の展開状態 */
  expanded?: boolean;
  /** キーボードショートカット（例: 'ctrl+s'） */
  keyboardShortcut?: string;
  /** 制御する要素のID（aria-controls用） */
  controlsId?: string;
  /** アニメーションを無効にするかどうか */
  disableAnimation?: boolean;
  /** 意味論的な役割を明示するためのプロパティ */
  role?: 'button' | 'switch' | 'checkbox' | 'menuitem' | 'tab' | string;
  /** ポップアップを持つボタンの場合trueに設定 */
  hasPopup?: boolean;
}

export const Button = ({
  className,
  variant = 'filled',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  iconOnly = false,
  pressed,
  expanded,
  keyboardShortcut,
  controlsId,
  disableAnimation = false,
  disabled,
  type = 'button',
  children,
  'aria-label': ariaLabel,
  role = 'button',
  hasPopup,
  ...props
}: ButtonProps) => {
  // 高コントラストモードの状態を管理
  const [isHighContrast, setIsHighContrast] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * 高コントラストモードの検出とリアクティブな対応
   * ユーザーのシステム設定が変更された場合も動的に対応します
   */
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

    /**
     * グローバルなキーボードショートカットを処理する関数
     * フォーカスがボタンにない状態でもショートカットを有効にします
     */
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
        !disabled &&
        !isLoading
      ) {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [keyboardShortcut, disabled, isLoading]);

  // キーボードイベントハンドラー
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    // 元のonKeyDownがある場合は呼び出す
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }

    // Spaceキーでクリックと同じ効果を発生させる
    handleKeyboardEvent(e, {
      ' ': () => {
        if (!disabled && !isLoading && buttonRef.current) {
          buttonRef.current.click();
        }
      }
    });
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        // 共通のベースクラス
        'inline-flex items-center justify-center rounded-full font-medium transition-all',
        // バリアントのスタイル - Material Design 3に準拠
        variant === 'filled' && 'bg-primary text-on-primary hover:bg-primary-dark active:bg-primary-darker',
        variant === 'outlined' && 'border border-outline text-primary hover:bg-primary-container/10 active:bg-primary-container/20',
        variant === 'text' && 'text-primary hover:bg-primary/10 active:bg-primary/20',
        variant === 'elevated' && 'bg-surface text-primary shadow-sm hover:shadow-md active:bg-surface-variant',
        variant === 'tonal' && 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container-dark active:bg-secondary-container-darker',
        // 高コントラストモードのスタイル
        isHighContrast && variant === 'filled' && 'bg-primary text-white border-2 border-black',
        isHighContrast && variant === 'outlined' && 'border-2 border-black text-black',
        isHighContrast && variant === 'text' && 'text-black underline',
        isHighContrast && variant === 'elevated' && 'bg-white text-black border-2 border-black shadow-none',
        isHighContrast && variant === 'tonal' && 'bg-gray-200 text-black border-2 border-black',
        // サイズ別の定義
        size === 'sm' && 'h-8 px-4 text-sm gap-2',  
        size === 'md' && 'h-10 px-6 text-base gap-2',  
        size === 'lg' && 'h-12 px-8 text-lg gap-3',  
        fullWidth && 'w-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        // 高コントラストモードでのフォーカス表示
        isHighContrast && 'focus-visible:ring-black focus-visible:ring-offset-0',
        // モーション軽減またはアニメーション無効時
        (disableAnimation) && 'transition-none',
        className
      )}
      onClick={(e) => {
        // リップルエフェクトの適用（非活性化やローディング中、アニメーション無効時を除く）
        if (!disabled && !isLoading && !disableAnimation) {
          createRippleEffect(e);
        }
        // 元のonClickハンドラを呼び出し
        if (!disabled && !isLoading && props.onClick) {
          props.onClick(e);
        }
      }}
      onKeyDown={handleKeyDown}
      // アクセシビリティ属性の設定
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading ? true : undefined}
      aria-busy={isLoading ? true : undefined}
      aria-pressed={pressed}
      aria-expanded={expanded}
      aria-controls={controlsId}
      aria-keyshortcuts={keyboardShortcut}
      tabIndex={disabled || isLoading ? -1 : 0}
      type={type}
      aria-label={iconOnly ? ariaLabel : undefined}
      role={
        // 役割を自動推論
        pressed !== undefined ? 'switch' : 
        expanded !== undefined ? 'button' : 
        role
      }
      aria-haspopup={hasPopup || expanded !== undefined ? true : undefined}
      aria-live={isLoading ? "polite" : undefined}
      {...props}
    >
      <span className="ripple-container relative overflow-hidden">
        {isLoading ? (
          <div
            className={cn(
              'h-4 w-4 animate-spin rounded-full border-2 border-t-transparent',
              variant === 'filled' && 'border-on-primary',
              variant === 'outlined' && 'border-primary',
              variant === 'text' && 'border-primary',
              variant === 'elevated' && 'border-primary',
              variant === 'tonal' && 'border-on-secondary-container',
              // 高コントラストモードでのローディングインジケーター
              isHighContrast && 'border-black border-t-transparent'
            )}
            aria-label="Loading"
            role="status"
          />
        ) : (
          <div className="inline-flex items-center justify-center">
            {startIcon && (
              <span 
                className="mr-2" 
                aria-hidden={iconOnly ? undefined : "true"} 
                role={iconOnly ? "img" : undefined}
              >
                {startIcon}
              </span>
            )}
            {children}
            {endIcon && (
              <span 
                className="ml-2" 
                aria-hidden={iconOnly ? undefined : "true"} 
                role={iconOnly ? "img" : undefined}
              >
                {endIcon}
              </span>
            )}
            {keyboardShortcut && (
              <span className="ml-2 text-xs opacity-70" aria-hidden="true">
                {keyboardShortcut.replace(/\+/g, ' + ').replace(/ctrl/i, 'Ctrl').replace(/alt/i, 'Alt').replace(/shift/i, 'Shift').replace(/meta|cmd|command/i, 'Cmd')}
              </span>
            )}
          </div>
        )}
      </span>
    </button>
  );
};
