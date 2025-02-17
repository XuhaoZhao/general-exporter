// This is the classname group for selecting the main container, we listen for changes here
export const MAIN_CONTAINER = "#__next";

// This is the classname group for selecting the main container, we listen for changes here
export const CHAT_CONTAINER = "main .flex.flex-col.items-center.text-sm";

// This is the classname group for selecting the answer container
export const ANSWER_CONTAINER =
  ".ds-markdown.ds-markdown--block";

// This extracts the actual content from the answer container
export const CONTENT_CONTAINER = ".ds-markdown.ds-markdown--block";

// This is the classname group for selecting the button container
export const BUTTON_CONTAINER = ".ds-flex";

// This is the container for modal
// Note: this does not have an ID
export const MODAL_CONTAINER = "chatgpt-exporter-modal";

// This is the container for context menu
// Note: this does not have an ID
export const MENU_CONTAINER = "chatgpt-exporter-menu";
