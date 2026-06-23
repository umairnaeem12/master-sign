import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads quote-request attachments to Firebase Storage and returns their
 * public download URLs. Files are grouped under a unique folder per submission
 * so they don't collide.
 *
 * Requires Firebase Storage to be enabled on the project and storage rules that
 * permit writes to `quote-uploads/**` (see STORAGE_RULES note in the PR/summary).
 */
export async function uploadQuoteFiles(files: File[]): Promise<string[]> {
  if (!files.length) return [];

  const folder = `quote-uploads/${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const urls = await Promise.all(
    files.map(async (file) => {
      // Keep the original filename but strip path separators for safety.
      const safeName = file.name.replace(/[/\\]/g, '_');
      const fileRef = ref(storage, `${folder}/${safeName}`);
      const snapshot = await uploadBytes(fileRef, file, {
        contentType: file.type || 'application/octet-stream',
      });
      return getDownloadURL(snapshot.ref);
    })
  );

  return urls;
}
