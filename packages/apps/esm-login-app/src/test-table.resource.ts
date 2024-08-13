import { type OpenMRSPaginatedResponse } from '@openmrs/esm-framework';

export async function getTestData(url: string): Promise<OpenMRSPaginatedResponse<number>> {
  const totalCount = 1337;
  const urlUrl = new URL(url, window.location.toString());
  const limit = Number.parseInt(urlUrl.searchParams.get('limit') ?? '50');
  const startIndex = Number.parseInt(urlUrl.searchParams.get('startIndex') ?? '0');

  const length = Math.max(0, Math.min(totalCount - startIndex, limit));
  const results = new Array(length).fill(0).map((_, i) => i + startIndex);
  const hasNext = startIndex + limit < totalCount;
  if (hasNext) {
    urlUrl.searchParams.set('startIndex', startIndex + limit + '');
  }
  const links = hasNext ? [{ rel: 'next', uri: urlUrl.toString() }] : [];
  await wait(1000);
  return { results, links, totalCount } as OpenMRSPaginatedResponse<number>;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
