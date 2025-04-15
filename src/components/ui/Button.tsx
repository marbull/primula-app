'use client';

import { cn, createRippleEffect, prefersHighContrast, handleKeyboardEvent } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode, useEffect, useState, useRef, KeyboardEvent } from 'react';

/**
 * Material Design 3に準拠したButtonコンポーネント
 * 
 * 特徴:
 * - バリアント: filled, outlined, text, elevated, tonal
 * - サイズ: sm, md, lg
 * - アイコン対応（startIcon, endIcon）
 * - キーボードショートカット機能
 * - 高コントラストモード対応
 * - アクセシビリティ対応（WAI-ARIA, キーボード操作, スクリーンリーダー）
 * - カスタマイズ機能（色, 形状, エフェクト）
 */

/** 型定義 */
// ボタンのスタイルバリエーション
type Variant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
// ボタンのサイズ
type Size = 'sm' | 'md' | 'lg';
// 角丸のスタイル
type RoundedStyle = 'full' | 'lg' | 'md' | 'sm' | 'none';
// ローディングインジケーターの種類
type LoadingIndicatorType = 'spinner' | 'dots' | 'progress' | 'custom';

/**
 * Buttonコンポーネントのプロパティ
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /***** コア機能関連 *****/
  /** スタイルバリアント */
  variant?: Variant;
  /** サイズ */
  size?: Size;
  /** 幅いっぱいに表示 */
  fullWidth?: boolean;
  /** 先頭アイコン */
  startIcon?: ReactNode;
  /** 末尾アイコン */
  endIcon?: ReactNode;
  /** アイコンのみボタン（aria-label必須） */
  iconOnly?: boolean;
  /** ローディング状態 */
  isLoading?: boolean;
  /** 角丸スタイル */
  rounded?: RoundedStyle;
  
  /***** 状態・相互作用関連 *****/
  /** トグル状態 */
  pressed?: boolean;
  /** 展開状態 */
  expanded?: boolean;
  /** キーボードショートカット (例: 'ctrl+s') */
  keyboardShortcut?: string;
  /** 制御対象要素ID (aria-controls) */
  controlsId?: string;
  /** アニメーション無効化 */
  disableAnimation?: boolean;
  
  /***** アクセシビリティ関連 *****/
  /** セマンティック役割 */
  role?: 'button' | 'switch' | 'checkbox' | 'menuitem' | 'tab' | string;
  /** ポップアップ有無 */
  hasPopup?: boolean;
  
  /***** カスタマイズ関連 *****/
  /** カスタム色使用フラグ */
  useCustomColors?: boolean;
  /** 背景色 */
  customBgColor?: string;
  /** テキスト色 */
  customTextColor?: string;
  /** ボーダー色 */
  customBorderColor?: string;
  /** ホバー時背景色 */
  hoverBgColor?: string;
  /** アクティブ時背景色 */
  activeBgColor?: string;
  
  /***** エフェクト関連 *****/
  /** リップルエフェクト色 */
  rippleColor?: string;
  /** リップルエフェクト持続時間(ms) */
  rippleDuration?: number;
  /** ローディング表示タイプ */
  loadingIndicatorType?: LoadingIndicatorType;
  /** カスタムローディング要素 */
  customLoadingIndicator?: ReactNode;
}

export const Button = ({
  // コア機能関連
  variant = 'filled',
  size = 'md',
  fullWidth = false,
  startIcon,
  endIcon,
  iconOnly = false,
  isLoading = false,
  rounded = 'full',
  
  // 状態・相互作用関連
  pressed,
  expanded,
  keyboardShortcut,
  controlsId,
  disableAnimation = false,
  disabled,
  
  // アクセシビリティ関連
  'aria-label': ariaLabel,
  role = 'button',
  hasPopup,
  
  // カスタマイズ関連
  useCustomColors = false,
  customBgColor,
  customTextColor,
  customBorderColor,
  hoverBgColor,
  activeBgColor,
  
  // エフェクト関連
  rippleColor,
  rippleDuration = 600,
  loadingIndicatorType = 'spinner',
  customLoadingIndicator,
  
  // その他の標準属性
  type = 'button',
  children,
  className,
  ...props
}: ButtonProps) => {
  // 高コントラストモードの状態
  const [isHighContrast, setIsHighContrast] = useState(false);
  // ダークモード検出（クライアント側でのみ実行）
  const [isDarkMode, setIsDarkMode] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * 高コントラストモード検出と動的対応
   */
  useEffect(() => {
    setIsHighContrast(prefersHighContrast());
    const mediaQuery = window.matchMedia('(prefers-contrast: more), (prefers-contrast: high)');
    const handleChange = () => setIsHighContrast(prefersHighContrast());
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * ダークモード検出と動的対応
   */
  useEffect(() => {
    // クライアントサイドでのダークモード検出
    if (typeof window !== 'undefined') {
      // 初期値設定
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      // 変更検出
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleDarkModeChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      
      darkModeQuery.addEventListener('change', handleDarkModeChange);
      return () => darkModeQuery.removeEventListener('change', handleDarkModeChange);
    }
  }, []);

  // iconOnly モードで aria-label がない場合の警告
  useEffect(() => {
    if (iconOnly && !ariaLabel && process.env.NODE_ENV !== 'production') {
      console.warn('Button: iconOnly=true のときは aria-label プロパティを必ず指定してください。アクセシビリティ上の問題があります。');
    }
  }, [iconOnly, ariaLabel]);

  // キーボードショートカット処理
  useEffect(() => {
    if (!keyboardShortcut) return;

    // グローバルキーボードショートカット処理
    const keys = keyboardShortcut.toLowerCase().split('+');
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // 入力フィールドでは無効化
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      // モディファイアキー判定
      const ctrlKey = keys.includes('ctrl') || keys.includes('control');
      const altKey = keys.includes('alt');
      const shiftKey = keys.includes('shift');
      const metaKey = keys.includes('meta') || keys.includes('cmd') || keys.includes('command');
      
      // 実際のキー（モディファイア以外）
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

  // リップルエフェクト処理
  const handleRippleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disableAnimation || disabled || isLoading) return;
    
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // カスタムリップル色適用
    if (rippleColor) {
      ripple.style.backgroundColor = rippleColor;
    }
    
    ripple.className = 'ripple-effect';
    button.querySelector('.ripple-container')?.appendChild(ripple);
    
    // 指定時間後に削除
    setTimeout(() => {
      ripple.remove();
    }, rippleDuration);
  };

  // キーボードイベント処理
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }

    // Spaceキーでクリック効果
    handleKeyboardEvent(e, {
      ' ': () => {
        if (!disabled && !isLoading && buttonRef.current) {
          buttonRef.current.click();
        }
      }
    });
  };

  // 角丸スタイル決定
  const getRoundedStyle = () => {
    switch (rounded) {
      case 'full': return 'rounded-full';
      case 'lg': return 'rounded-lg';
      case 'md': return 'rounded-md';
      case 'sm': return 'rounded-sm';
      case 'none': return 'rounded-none';
      default: return 'rounded-full';
    }
  };

  // ローディングインジケーター生成
  const renderLoadingIndicator = () => {
    switch (loadingIndicatorType) {
      case 'spinner':
        return (
          <div
            className={cn(
              'h-4 w-4 animate-spin rounded-full border-2 border-t-transparent',
              variant === 'filled' && 'border-on-primary dark:border-on-primary-dark',
              variant === 'outlined' && 'border-primary dark:border-primary-dark',
              variant === 'text' && 'border-primary dark:border-primary-dark',
              variant === 'elevated' && 'border-primary dark:border-primary-dark',
              variant === 'tonal' && 'border-on-secondary-container dark:border-on-secondary-container-dark',
              isHighContrast && 'border-black border-t-transparent dark:border-white dark:border-t-transparent'
            )}
            aria-label="Loading"
            role="status"
          />
        );
      case 'dots':
        return (
          <div className="flex space-x-1" aria-label="Loading" role="status">
            <div className={`h-2 w-2 rounded-full ${variant === 'filled' ? 'bg-on-primary' : 'bg-primary'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`h-2 w-2 rounded-full ${variant === 'filled' ? 'bg-on-primary' : 'bg-primary'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`h-2 w-2 rounded-full ${variant === 'filled' ? 'bg-on-primary' : 'bg-primary'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      case 'progress':
        return (
          <div className="w-12 h-1 bg-gray-200 overflow-hidden rounded-full" aria-label="Loading" role="status">
            <div className={`h-full ${variant === 'filled' ? 'bg-on-primary' : 'bg-primary'} animate-progressBar`}></div>
          </div>
        );
      case 'custom':
        return customLoadingIndicator || (
          <div className="h-4 w-4 animate-pulse" aria-label="Loading" role="status"></div>
        );
      default:
        return null;
    }
  };

  // カスタムCSSプロパティの型定義
  interface CustomCSSProperties extends React.CSSProperties {
    '--hover-bg-color'?: string;
    '--active-bg-color'?: string;
  }

  // カスタムスタイル生成
  const getCustomStyles = () => {
    if (!useCustomColors && !hoverBgColor && !activeBgColor) return {};

    const styles: CustomCSSProperties = {};
    
    if (customBgColor) styles.backgroundColor = customBgColor;
    if (customTextColor) styles.color = customTextColor;
    if (customBorderColor) styles.borderColor = customBorderColor;
    
    // Tailwind JITが動作しない環境向けのフォールバック
    if (hoverBgColor) {
      styles['--hover-bg-color'] = hoverBgColor;
    }
    if (activeBgColor) {
      styles['--active-bg-color'] = activeBgColor;
    }
    
    return styles;
  };

  // カスタムホバー/アクティブクラス生成
  const getCustomStateClasses = () => {
    if (!hoverBgColor && !activeBgColor) return '';
    
    const classes = [];
    if (hoverBgColor) {
      classes.push(`hover:bg-[${hoverBgColor}]`);
      // フォールバック用CSSクラス
      classes.push('hover:has-custom-hover-bg');
    }
    if (activeBgColor) {
      classes.push(`active:bg-[${activeBgColor}]`);
      // フォールバック用CSSクラス
      classes.push('active:has-custom-active-bg');
    }
    
    return classes.join(' ');
  };

  // roleの決定ロジック
  const getRole = (): string => {
    // 明示的に指定されたroleを最優先
    if (role && role !== 'button') return role;
    
    // 状態に基づく自動決定
    if (pressed !== undefined) return 'switch';
    if (expanded !== undefined) return 'button';
    
    // デフォルト
    return 'button';
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        // ベースクラス
        'inline-flex items-center justify-center font-medium transition-all',
        // 角丸スタイル
        getRoundedStyle(),
        // Material Design 3バリアント (ダークモード対応)
        variant === 'filled' && 'bg-primary text-on-primary hover:bg-primary-dark active:bg-primary-darker dark:bg-primary-dark dark:text-on-primary-dark dark:hover:bg-primary dark:active:bg-primary-light',
        variant === 'outlined' && 'border border-outline text-primary hover:bg-primary-container/10 active:bg-primary-container/20 dark:border-outline-dark dark:text-primary-dark dark:hover:bg-primary-container-dark/10 dark:active:bg-primary-container-dark/20',
        variant === 'text' && 'text-primary hover:bg-primary/10 active:bg-primary/20 dark:text-primary-dark dark:hover:bg-primary-dark/10 dark:active:bg-primary-dark/20',
        variant === 'elevated' && 'bg-surface text-primary shadow-sm hover:shadow-md active:bg-surface-variant dark:bg-surface-dark dark:text-primary-dark dark:active:bg-surface-variant-dark',
        variant === 'tonal' && 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container-dark active:bg-secondary-container-darker dark:bg-secondary-container-dark dark:text-on-secondary-container-dark dark:hover:bg-secondary-container dark:active:bg-secondary-container-light',
        useCustomColors && 'border',
        // カスタムステートクラス
        getCustomStateClasses(),
        // 高コントラストモード (ダークモード対応)
        isHighContrast && variant === 'filled' && 'bg-primary text-white border-2 border-black dark:bg-primary-dark dark:text-black dark:border-white',
        isHighContrast && variant === 'outlined' && 'border-2 border-black text-black dark:border-white dark:text-white',
        isHighContrast && variant === 'text' && 'text-black underline dark:text-white',
        isHighContrast && variant === 'elevated' && 'bg-white text-black border-2 border-black shadow-none dark:bg-black dark:text-white dark:border-white',
        isHighContrast && variant === 'tonal' && 'bg-gray-200 text-black border-2 border-black dark:bg-gray-800 dark:text-white dark:border-white',
        // サイズ
        size === 'sm' && 'h-8 px-4 text-sm gap-2',  
        size === 'md' && 'h-10 px-6 text-base gap-2',  
        size === 'lg' && 'h-12 px-8 text-lg gap-3',  
        fullWidth && 'w-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 dark:focus-visible:ring-primary-dark/50',
        isHighContrast && 'focus-visible:ring-black focus-visible:ring-offset-0 dark:focus-visible:ring-white',
        disableAnimation && 'transition-none',
        className
      )}
      style={getCustomStyles()}
      onClick={(e) => {
        // リップルエフェクト適用
        if (!disabled && !isLoading && !disableAnimation) {
          if (rippleColor || rippleDuration !== 600) {
            handleRippleEffect(e);
          } else {
            createRippleEffect(e);
          }
        }
        // イベントハンドラ呼び出し
        if (!disabled && !isLoading && props.onClick) {
          props.onClick(e);
        }
      }}
      onKeyDown={handleKeyDown}
      // アクセシビリティ属性
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
      role={getRole()}
      aria-haspopup={hasPopup || expanded !== undefined ? true : undefined}
      aria-live={isLoading ? "polite" : undefined}
      {...props}
    >
      <span className="ripple-container overflow-hidden" data-testid="ripple-container">
        {isLoading ? (
          renderLoadingIndicator()
        ) : (
          <div className="inline-flex items-center justify-center w-full">
            {startIcon && (
              <span 
                className="mr-2 flex-shrink-0" 
                aria-hidden={iconOnly ? undefined : "true"} 
                role={iconOnly ? "img" : undefined}
              >
                {startIcon}
              </span>
            )}
            <span className={keyboardShortcut ? 'flex-grow' : ''}>{children}</span>
            {endIcon && (
              <span 
                className="ml-2 flex-shrink-0" 
                aria-hidden={iconOnly ? undefined : "true"} 
                role={iconOnly ? "img" : undefined}
              >
                {endIcon}
              </span>
            )}
            {keyboardShortcut && (
              <span className="ml-auto pl-2 text-xs opacity-70 flex-shrink-0" aria-hidden="true">
                {keyboardShortcut.replace(/\+/g, ' + ').replace(/ctrl/i, 'Ctrl').replace(/alt/i, 'Alt').replace(/shift/i, 'Shift').replace(/meta|cmd|command/i, 'Cmd')}
              </span>
            )}
          </div>
        )}
      </span>
    </button>
  );
};
