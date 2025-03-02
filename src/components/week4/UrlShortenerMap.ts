import { HashMapCollection } from "../../utils/collections/collection";

class UrlShortenerMap {
  private urlMap: HashMapCollection<string>;

  constructor() {
    this.urlMap = new HashMapCollection<string>();
  }

  generateShortURL(longURL: string): string {
    return this.urlMap.setWithHash(longURL, longURL);
  }

  getOriginalURL(shortURL: string): string | null {
    return this.urlMap.get(shortURL) || null;
  }

  clear(): void {
    this.urlMap.clear();
  }
}

export default UrlShortenerMap;
