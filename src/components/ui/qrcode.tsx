
import React from 'react';
import ReactQRCode from 'react-qr-code';

export interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 128,
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'L',
  className,
  style,
  title,
}) => {
  return (
    <div className={className} style={style}>
      <ReactQRCode
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        title={title}
      />
    </div>
  );
};

export default QRCode;
