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
              variant === 'filled' && 'border-on-primary',
              variant === 'outlined' && 'border-primary',
              variant === 'text' && 'border-primary',
              variant === 'elevated' && 'border-primary',
              variant === 'tonal' && 'border-on-secondary-container',
              isHighContrast && 'border-black border-t-transparent'
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

  // カスタムスタイル生成
  const getCustomStyles = () => {
    if (!useCustomColors) return {};

    const styles: React.CSSProperties = {};
    
    if (customBgColor) styles.backgroundColor = customBgColor;
    if (customTextColor) styles.color = customTextColor;
    if (customBorderColor) styles.borderColor = customBorderColor;
    
    return styles;
  };

  // カスタムホバー/アクティブクラス生成
  const getCustomStateClasses = () => {
    if (!hoverBgColor && !activeBgColor) return '';
    
    const classes = [];
    if (hoverBgColor) {
      classes.push(`hover:bg-[${hoverBgColor}]`);
    }
    if (activeBgColor) {
      classes.push(`active:bg-[${activeBgColor}]`);
    }
    
    return classes.join(' ');
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        // ベースクラス
        'inline-flex items-center justify-center font-medium transition-all',
        // 角丸スタイル
        getRoundedStyle(),
        // Material Design 3バリアント
        variant === 'filled' && 'bg-primary text-on-primary hover:bg-primary-dark active:bg-primary-darker',
        variant === 'outlined' && 'border border-outline text-primary hover:bg-primary-container/10 active:bg-primary-container/20',
        variant === 'text' && 'text-primary hover:bg-primary/10 active:bg-primary/20',
        variant === 'elevated' && 'bg-surface text-primary shadow-sm hover:shadow-md active:bg-surface-variant',
        variant === 'tonal' && 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container-dark active:bg-secondary-container-darker',
        useCustomColors && 'border',
        // カスタムステートクラス
        getCustomStateClasses(),
        // 高コントラストモード
        isHighContrast && variant === 'filled' && 'bg-primary text-white border-2 border-black',
        isHighContrast && variant === 'outlined' && 'border-2 border-black text-black',
        isHighContrast && variant === 'text' && 'text-black underline',
        isHighContrast && variant === 'elevated' && 'bg-white text-black border-2 border-black shadow-none',
        isHighContrast && variant === 'tonal' && 'bg-gray-200 text-black border-2 border-black',
        // サイズ
        size === 'sm' && 'h-8 px-4 text-sm gap-2',  
        size === 'md' && 'h-10 px-6 text-base gap-2',  
        size === 'lg' && 'h-12 px-8 text-lg gap-3',  
        fullWidth && 'w-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        isHighContrast && 'focus-visible:ring-black focus-visible:ring-offset-0',
        disableAnimation && 'transition-none',
        // Material Design 3に準拠したdisable状態の透明度 (38%)
        (disabled || isLoading) && 'opacity-[0.38] pointer-events-none',
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
      role={
        pressed !== undefined ? 'switch' : 
        expanded !== undefined ? 'button' : 
        role
      }
      aria-haspopup={hasPopup || expanded !== undefined ? true : undefined}
      aria-live={isLoading ? "polite" : undefined}
      {...props}
    >
      <span className="ripple-container overflow-hidden">
        {isLoading ? (
          renderLoadingIndicator()
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