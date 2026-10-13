export type AssetType = 'image' | 'svg' | 'background-image' | 'video' | 'audio';

export interface PageAsset {
  id: string;
  type: AssetType;
  url: string;
  altText?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSizeFormatted?: string;
  isInlineSvg?: boolean;
  svgContent?: string;
}
