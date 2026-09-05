// Cognitoのエラーコード → 日本語メッセージ
export const COGNITO_ERROR_MESSAGES: Record<string, string> = {
  UsernameExistsException: "このメールアドレスは既に登録されています",
  InvalidPasswordException:
    "パスワードの形式が正しくありません（8文字以上で、大文字・小文字・数字を含めてください）",
  InvalidParameterException: "入力内容が正しくありません",
  NotAuthorizedException: "メールアドレスまたはパスワードが正しくありません",
  UserNotFoundException: "ユーザーが見つかりません",
  UserNotConfirmedException: "メールアドレスの確認が完了していません",
  CodeMismatchException: "確認コードが正しくありません",
  ExpiredCodeException: "確認コードの有効期限が切れています",
  LimitExceededException: "試行回数が上限に達しました。しばらくしてから再度お試しください",
  TooManyRequestsException: "リクエストが多すぎます。しばらくしてから再度お試しください",
  TooManyFailedAttemptsException: "試行回数が上限に達しました。しばらくしてから再度お試しください",
  PasswordResetRequiredException: "パスワードの再設定が必要です",
};

// err.code / err.name を見て日本語メッセージに変換する。
// overrides は同じエラーコードでも画面によって文言を変えたい場合に使う
// （例: パスワード変更画面の NotAuthorizedException は「現在のパスワードが正しくありません」）
export function translateCognitoError(
  err: unknown,
  fallback: string,
  overrides?: Partial<Record<string, string>>
): string {
  const code =
    (err as { code?: string; name?: string })?.code ??
    (err as { code?: string; name?: string })?.name;
  if (code && overrides?.[code]) return overrides[code]!;
  if (code && COGNITO_ERROR_MESSAGES[code]) return COGNITO_ERROR_MESSAGES[code];
  return fallback;
}

// 認証系フォーム（ログイン・新規登録・パスワードリセット）のメッセージ
export const AUTH_MESSAGES = {
  LOGIN_FAILED: "ログインに失敗しました",
  REGISTER_FAILED: "登録に失敗しました",
  CONFIRM_CODE_INVALID: "確認コードが正しくありません",
  PASSWORD_MISMATCH: "パスワードが一致しません",
  RESET_REQUEST_FAILED: "送信に失敗しました",
  RESET_CONFIRM_FAILED: "パスワードの再設定に失敗しました",
} as const;

// アカウント設定画面のメッセージ
export const PROFILE_MESSAGES = {
  UPDATE_SUCCESS: "プロフィールを更新しました",
  UPDATE_FAILED: "プロフィールの更新に失敗しました",
  NEW_PASSWORD_MISMATCH: "新しいパスワードが一致しません",
  PASSWORD_CHANGE_SUCCESS: "パスワードを変更しました",
  PASSWORD_CHANGE_FAILED: "パスワードの変更に失敗しました",
  CURRENT_PASSWORD_INCORRECT: "現在のパスワードが正しくありません",
  DELETE_CONFIRM:
    "アカウントを削除しますか？すべての記録データが完全に削除されます。この操作は取り消せません。",
  DELETE_FAILED: "アカウントの削除に失敗しました",
} as const;
