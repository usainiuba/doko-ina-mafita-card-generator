import { useCallback, useEffect, useRef, useState } from 'react';
import { generateCardBlob, triggerDownload } from '../utils/generateCard.js';

/** Creates the PNG from the hidden full-size card, starts the download and keeps the result for the "ready" panel. */
export default function useCardGenerator(nodeRef) {
  const [status, setStatus] = useState('idle'); // idle | working | done | error
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);   // { url, blob, filename }
  const urlRef = useRef(null);

  const revoke = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const clear = useCallback(() => {
    revoke();
    setResult(null);
    setStatus('idle');
    setError('');
  }, [revoke]);

  const generate = useCallback(async (filename) => {
    setStatus('working');
    setError('');
    try {
      const blob = await generateCardBlob(nodeRef.current);
      revoke();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setResult({ url, blob, filename });
      triggerDownload(url, filename);
      setStatus('done');
    } catch (e) {
      console.error(e);
      setError('The card could not be created on this browser. Please try again, or use Chrome / Safari.');
      setStatus('error');
    }
  }, [nodeRef, revoke]);

  useEffect(() => revoke, [revoke]);

  return { status, error, result, generate, clear };
}
