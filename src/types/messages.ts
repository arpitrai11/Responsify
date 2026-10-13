export type ExtensionAction =
  | 'PING'
  | 'GET_TAB_INFO'
  | 'TOGGLE_PICKER'
  | 'START_PICKER'
  | 'STOP_PICKER'
  | 'ELEMENT_HOVERED'
  | 'ELEMENT_SELECTED'
  | 'CLEAR_SELECTION'
  | 'APPLY_CSS'
  | 'REMOVE_CSS'
  | 'RESET_ELEMENT_CSS'
  | 'UPDATE_TEXT'
  | 'RESET_TEXT'
  | 'UPDATE_IMAGE'
  | 'RESET_IMAGE'
  | 'SET_XRAY'
  | 'SET_GRID'
  | 'SET_DARK_THEME'
  | 'SET_COLOR_BLINDNESS'
  | 'GET_VISUAL_MODES'
  | 'DISCOVER_ASSETS'
  | 'ASSETS_DISCOVERED'
  | 'SYNC_SCROLL'
  | 'SYNC_SCROLL_DELTA'
  | 'RECORD_CHANGE'
  | 'REVERT_CHANGE'
  | 'GET_PAGE_INFO'
  | 'OPEN_SIDEPANEL'
  | 'OPEN_WORKSPACE'
  | 'DOWNLOAD_ASSET'
  | 'SET_DEVICE_EMULATION'
  | 'RESET_DEVICE_EMULATION';

export interface ExtensionMessage<T = unknown> {
  action: ExtensionAction;
  payload?: T;
  tabId?: number;
}

export interface ExtensionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
