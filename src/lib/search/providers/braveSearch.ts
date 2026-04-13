import axios from 'axios';
import { getBraveSearchApiKey } from '../../config';
import type {
  SearchProvider,
  SearchOptions,
  SearchResponse,
  SearchResult,
} from './types';

/**
 * Brave Search API provider implementation
 * Docs: https://api.search.brave.com/app/documentation/web-search/get-started
 *
 * Site restrictions are applied via Brave Goggles (goggles_id parameter),
 * which is passed through opts.cx — the same slot used for Google CSE's CX.
 * Set goggles_id to a publicly accessible URL of a .goggle filter file.
 */
export class BraveSearchProvider implements SearchProvider {
  async search(query: string, opts?: SearchOptions): Promise<SearchResponse> {
    const apiKey =
      process.env.BRAVE_API_KEY || getBraveSearchApiKey();

    if (!apiKey) {
      throw new Error(
        'Brave Search API key is required. Set BRAVE_API_KEY environment variable or config.toml [SEARCH.BRAVE_SEARCH] API_KEY.',
      );
    }

    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.append('q', query);
    url.searchParams.append('count', '20');

    // opts.cx carries the Brave Goggles URL (equivalent of Google's CX engine ID)
    if (opts?.cx) {
      url.searchParams.append('goggles_id', opts.cx);
    }

    if (opts?.language) {
      url.searchParams.append('search_lang', opts.language);
    }

    if (opts?.pageno && opts.pageno > 1) {
      const offset = (opts.pageno - 1) * 20;
      url.searchParams.append('offset', offset.toString());
    }

    try {
      const res = await axios.get(url.toString(), {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
      });

      const webResults = res.data.web?.results || [];
      const results: SearchResult[] = webResults.map((item: any) => ({
        title: item.title || '',
        url: item.url || '',
        content: item.description || '',
        img_src: item.thumbnail?.src || undefined,
      }));

      return { results, suggestions: [] };
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        console.error('[Brave Search] API Error:');
        console.error('Status:', status);
        console.error('Data:', JSON.stringify(errorData, null, 2));
        console.error(
          'Request URL:',
          url.toString().replace(apiKey, 'REDACTED'),
        );

        if (status === 401) {
          throw new Error(
            'Brave Search API key is invalid or expired. Check your BRAVE_API_KEY.',
          );
        }

        if (status === 429) {
          throw new Error(
            'Brave Search API rate limit exceeded. Check your subscription plan.',
          );
        }

        throw new Error(
          `Brave Search API error (${status}): ${errorData?.message || error.message}`,
        );
      }

      throw new Error(`Brave Search error: ${error.message || 'Unknown error'}`);
    }
  }
}
