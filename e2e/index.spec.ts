import { test, expect } from '@playwright/test';

test('completes a typing session and shows results', async ({ page }) => {
  await page.goto('/');

  // Hidden input must be present with the word list
  const input = page.getByTestId('typing-input');
  await expect(input).toBeAttached();

  const wordsToType = await input.getAttribute('data-wordstotype');
  expect(wordsToType).toBeTruthy();

  // Word display is visible before typing
  await expect(page.getByTestId('word-display')).toBeVisible();

  // Type all words — spaces advance each word, last word auto-completes on final letter
  await input.pressSequentially(wordsToType!, { delay: 30 });

  // Typing overlay unmounts when session ends
  await expect(page.getByTestId('word-display')).not.toBeAttached({ timeout: 5000 });

  // Result screen stats must all appear
  await expect(page.getByTestId('result-wpm')).toBeVisible();
  await expect(page.getByTestId('result-raw-wpm')).toBeVisible();
  await expect(page.getByTestId('result-accuracy')).toBeVisible();
  await expect(page.getByTestId('result-time')).toBeVisible();
});
