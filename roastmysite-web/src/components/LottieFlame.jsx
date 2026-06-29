import { useLottie } from 'lottie-react';
import emberAnimation from '../assets/ember-intro.json';

// Use the named useLottie hook rather than the default export — the default
// import resolves to the module namespace object under Vite's CJS interop.
// Isolated so lottie-web + the JSON are code-split into their own chunk.
export default function LottieFlame() {
  const { View } = useLottie(
    { animationData: emberAnimation, loop: true, autoplay: true },
    { width: '100%', height: '100%' }
  );

  return (
    <div className="intro-flame" aria-hidden="true">
      {View}
    </div>
  );
}
