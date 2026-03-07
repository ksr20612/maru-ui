import type { Preview } from '@storybook/react';

// 각 컴포넌트 패키지 스타일 (추가 패키지 생기면 여기에 import)
import '../picker-view/src/components/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
