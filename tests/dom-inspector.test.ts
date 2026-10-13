import { describe, it, expect, beforeEach } from 'vitest';
import { getUniqueSelector, getBoxModel, getHierarchy } from '../src/utils/dom-utils';

describe('DOM Inspector Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="main-container" class="container mx-auto">
        <header class="site-header">
          <nav>
            <ul class="nav-list">
              <li class="nav-item"><a href="#" class="nav-link">Home</a></li>
              <li class="nav-item"><a href="#" class="nav-link active" id="about-link">About</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <article class="post">
            <h1 class="post-title">Title Here</h1>
            <p class="post-body">Sample text inside article</p>
          </article>
        </main>
      </div>
    `;
  });

  it('generates unique ID selector when element has id', () => {
    const el = document.getElementById('about-link')!;
    expect(getUniqueSelector(el)).toBe('#about-link');
  });

  it('generates meaningful structural path selector when element lacks id', () => {
    const title = document.querySelector('.post-title')!;
    const selector = getUniqueSelector(title);
    expect(selector).toContain('h1.post-title');
  });

  it('extracts box model margins, borders, and paddings', () => {
    const article = document.querySelector('.post') as HTMLElement;
    article.style.padding = '10px';
    article.style.margin = '20px';
    article.style.border = '1px solid black';

    const box = getBoxModel(article);
    expect(box.margin).toBeDefined();
    expect(box.padding).toBeDefined();
    expect(box.border).toBeDefined();
    expect(box.content).toBeDefined();
  });

  it('extracts parent hierarchy tree', () => {
    const link = document.getElementById('about-link')!;
    const hierarchy = getHierarchy(link);
    expect(hierarchy.length).toBeGreaterThanOrEqual(4);
    expect(hierarchy[hierarchy.length - 1].tagName).toBe('a');
  });
});
