import { useEffect, useState } from 'react';
import { getCountries, CountryInfo } from '../api/main';

/** 국가 목록 조회 + 검색어로 필터링 (여행지 선택 화면들에서 공용으로 사용) */
export function useCountrySearch() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await getCountries();
        setCountries(list);
      } catch {
        setCountries([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = countries.filter(
    c =>
      !query.trim() ||
      c.cityName.includes(query) ||
      c.countryName.includes(query),
  );

  return { query, setQuery, loading, filtered };
}
