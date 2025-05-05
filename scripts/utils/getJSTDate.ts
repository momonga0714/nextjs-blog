/**
 * 現在時刻を日本時間（Asia/Tokyo）基準で取得する
 */
export const getJSTDate = (): Date =>
  // toLocaleString で「JST の文字列」を作り、
  // それを new Date に渡してローカル（UTC）上で正しいオフセットに調整させる
  new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })
  );
