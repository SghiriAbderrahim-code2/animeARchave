// يحدد ما إذا كان المحتوى مخصراً للكبار (+18)
// يفحص تصنيف Hentai/Erotica و rating Rx في MyAnimeList
const ADULT_GENRE_IDS = [12, 49]; // 12 = Hentai, 49 = Erotica

export default function isAdult(anime) {
  if (!anime) return false;
  if (anime.rating === 'rx') return true;
  const genres = [
    ...(anime.genres ?? []),
    ...(anime.explicit_genres ?? []),
  ];
  return genres.some((g) => ADULT_GENRE_IDS.includes(g.mal_id));
}
