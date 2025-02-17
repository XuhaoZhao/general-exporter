import React from "react";
import ReactDOMClient from "react-dom/client";
import ContextMenu from "./ContextMenu";
import Modal from "./Modal";

import {
  BUTTON_CONTAINER,
  CONTENT_CONTAINER,
} from "./utils/constants";

import uncheckedIcon from "./icons/unselect.png";

const SELECTED_ITEMS: Set<HTMLElement> = new Set();
const CONTEXT_MENU_ID = "fixed-context-menu";
// 全局状态
let isSelectMode = false; // 是否处于选择模式

// 为所有 question 元素添加选择框
const addCheckboxesToQuestions = () => {
  const answers = document.querySelectorAll(CONTENT_CONTAINER);
  answers.forEach((answer) => {
    const buttonContainer = answer.parentElement?.querySelector(BUTTON_CONTAINER);
    if (buttonContainer && !buttonContainer.querySelector('input[type="checkbox"]')) {
      const checkboxContainer = document.createElement("div");
      checkboxContainer.style.display = "flex";
      checkboxContainer.style.alignItems = "center";
      checkboxContainer.style.cursor = "pointer";
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.marginRight = "5px";
      checkbox.addEventListener("change", handleCheckboxChange);
  
      const imageElement = document.createElement("img");
      imageElement.src = uncheckedIcon;
      imageElement.style.width = "20px";
  
      checkbox.appendChild(imageElement);
      checkboxContainer.appendChild(checkbox);
      buttonContainer.appendChild(checkboxContainer);
    }
  });
};
// 切换选择模式
const toggleSelectMode = (isSelect: boolean) => {
  isSelectMode = isSelect;
  const selectButton = document.getElementById("select-button");
  if (selectButton) {
    selectButton.textContent = isSelect ? "cancel" : "select";
  }

  // 显示或隐藏全选框
  const selectAllContainer = document.getElementById("select-all-container");
  if (selectAllContainer) {
    selectAllContainer.style.display = isSelect ? "flex" : "none";
  }

  // 如果取消选择模式，移除所有选择框
  if (!isSelect) {
    removeCheckboxesFromQuestions();
    SELECTED_ITEMS.clear();
  }
};



// 移除全选框
const removeSelectAllCheckbox = () => {
  const selectAllContainer = document.getElementById("select-all-container");
  if (selectAllContainer) {
    selectAllContainer.remove();
  }
};

// 移除所有 question 的选择框
const removeCheckboxesFromQuestions = () => {
  const questions = document.querySelectorAll(".question");
  questions.forEach((question) => {
    const checkbox = question.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.remove();
    }
  });
  SELECTED_ITEMS.clear();
};
// 创建菜单栏
const createSelectMenu = (trigger: HTMLElement,offsetX: number) => {
  const rect = trigger.getBoundingClientRect();
  const menu = document.createElement("div");
  menu.style.left = `${rect.left + offsetX}px`;
  menu.style.position = "absolute";
  menu.style.bottom = "50px";
  menu.style.backgroundColor = "#fff";
  menu.style.border = "1px solid #ccc";
  menu.style.borderRadius = "4px";
  menu.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  menu.style.padding = "8px 0";
  menu.style.zIndex = "1000";
  menu.style.display = "none"; // 默认隐藏
  

  // 添加 question 按钮
  const questionButton = document.createElement("div");
  questionButton.textContent = "question";
  questionButton.style.padding = "8px 16px";
  questionButton.style.cursor = "pointer";
  questionButton.addEventListener("click", () => {
    addCheckboxesToQuestions();
    toggleSelectMode(true);
    menu.style.display = "none"; // 隐藏菜单
  });

  // 添加 answer 按钮
  const answerButton = document.createElement("div");
  answerButton.textContent = "answer";
  answerButton.style.padding = "8px 16px";
  answerButton.style.cursor = "pointer";
  answerButton.addEventListener("click", () => {
    // 这里可以添加 answer 的逻辑
    menu.style.display = "none"; // 隐藏菜单
  });

  menu.appendChild(questionButton);
  menu.appendChild(answerButton);

  return menu;
};

// 创建菜单栏
const createExportMenu = (trigger: HTMLElement,offsetX: number) => {
  const rect = trigger.getBoundingClientRect();
  const menu = document.createElement("div");
  menu.style.left = `${rect.left + offsetX}px`;
  menu.style.position = "absolute";
  menu.style.bottom = "50px";
  menu.style.backgroundColor = "#fff";
  menu.style.border = "1px solid #ccc";
  menu.style.borderRadius = "4px";
  menu.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  menu.style.padding = "8px 0";
  menu.style.zIndex = "1000";
  menu.style.display = "none"; // 默认隐藏
  

  // 添加 导出到MD 按钮
  const toMd = document.createElement("div");
  toMd.textContent = "toMD";
  toMd.style.padding = "8px 16px";
  toMd.style.cursor = "pointer";
  toMd.addEventListener("click", () => {
    // addCheckboxesToQuestions();
    // toggleSelectMode(true);
    menu.style.display = "none"; // 隐藏菜单
  });

  // 添加 导出到PDF 按钮
  const toPDF = document.createElement("div");
  toPDF.textContent = "toPDF";
  toPDF.style.padding = "8px 16px";
  toPDF.style.cursor = "pointer";
  toPDF.addEventListener("click", () => {
    // 这里可以添加 answer 的逻辑
    menu.style.display = "none"; // 隐藏菜单
  });

  menu.appendChild(toMd);
  menu.appendChild(toPDF);

  return menu;
};
// 处理复选框点击事件
const handleCheckboxChange = (event: Event) => {
  const checkbox = event.target as HTMLInputElement;
  const content = checkbox.parentElement?.parentElement?.parentElement?.querySelector(CONTENT_CONTAINER) as HTMLElement | null;
  if (content) {
    if (checkbox.checked) {
      console.log("checked");
      SELECTED_ITEMS.add(content);
    } else {
      console.log("unchecked");
      SELECTED_ITEMS.delete(content);
    }
  }
};

// 处理全选框点击事件
const handleSelectAllChange = (event: Event) => {
  const selectAllCheckbox = event.target as HTMLInputElement;
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#select-all)');

  checkboxes.forEach((checkbox) => {
    const content = checkbox.parentElement?.parentElement?.parentElement?.querySelector(CONTENT_CONTAINER) as HTMLElement | null;
    if (content) {
      if (selectAllCheckbox.checked) {
        (checkbox as HTMLInputElement).checked = true;
        SELECTED_ITEMS.add(content);
      } else {
        (checkbox as HTMLInputElement).checked = false;
        SELECTED_ITEMS.delete(content);
      }
    }
  });
};

// 在目标内容区域添加复选框
const addCheckboxToContent = () => {
  const answers = document.querySelectorAll(CONTENT_CONTAINER);
  answers.forEach((div) => {
    if (div?.parentElement) {
      loadCheckbox(div.parentElement);
    }
  });
};

const loadCheckbox = (container: Element) => {
  const buttonContainer = container.querySelector(BUTTON_CONTAINER);
  if (buttonContainer && !buttonContainer.querySelector('input[type="checkbox"]')) {
    const checkboxContainer = document.createElement("div");
    checkboxContainer.style.display = "flex";
    checkboxContainer.style.alignItems = "center";
    checkboxContainer.style.cursor = "pointer";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "5px";
    checkbox.addEventListener("change", handleCheckboxChange);

    const imageElement = document.createElement("img");
    imageElement.src = uncheckedIcon;
    imageElement.style.width = "20px";

    checkbox.appendChild(imageElement);
    checkboxContainer.appendChild(checkbox);
    buttonContainer.appendChild(checkboxContainer);
  }
};

// 添加全选框
const addSelectAllCheckbox = () => {
  const textareaByPlaceholder = document.querySelector('textarea[placeholder="给 DeepSeek 发送消息 "]');
  console.log(textareaByPlaceholder);
  if (textareaByPlaceholder) {
    const grandParent = textareaByPlaceholder.parentElement?.parentElement?.parentElement;
    if (grandParent) {
      // 检查是否已经存在全选框，避免重复添加
      if (grandParent.querySelector('#select-all-container')) {
        return;
      }

      // 创建一个新的容器来包裹 grandParent 和全选框
      const wrapperContainer = document.createElement("div");
      wrapperContainer.style.display = "flex";
      wrapperContainer.style.alignItems = "center";
      wrapperContainer.style.justifyContent = "space-between"; // 将 grandParent 和全选框并排放置

      // 将 grandParent 移动到新的容器中
      if (grandParent.parentElement) {
        grandParent.parentElement.insertBefore(wrapperContainer, grandParent);
        wrapperContainer.appendChild(grandParent);
      }

      // 创建全选框容器
      const selectAllContainer = document.createElement("div");
      selectAllContainer.id = "select-all-container";
      selectAllContainer.style.display = "flex";
      selectAllContainer.style.alignItems = "center";
      selectAllContainer.style.cursor = "pointer";
      selectAllContainer.style.marginLeft = "10px"; // 添加左边距，避免贴边

      // 创建全选框
      const selectAllCheckbox = document.createElement("input");
      selectAllCheckbox.type = "checkbox";
      selectAllCheckbox.id = "select-all";
      selectAllCheckbox.style.marginRight = "5px";
      selectAllCheckbox.addEventListener("change", handleSelectAllChange);
      // 将全选框和标签添加到容器中
      selectAllContainer.appendChild(selectAllCheckbox);

      // 将全选框容器添加到新的容器中
      wrapperContainer.appendChild(selectAllContainer);
    }
  }
};
// 初始化
const init = () => {

  const textareaByPlaceholder = document.querySelector('textarea[placeholder="给 DeepSeek 发送消息 "]');
  console.log(textareaByPlaceholder);
  if (textareaByPlaceholder){
    const grandParent = textareaByPlaceholder.parentElement?.parentElement?.parentElement?.parentElement;
    if (grandParent) {
      // 创建一个新的容器来包裹 grandParent 和全选框
      const wrapperContainer = document.createElement("div");
      wrapperContainer.style.display = "flex";


      // 将 grandParent 移动到新的容器中
      if (grandParent.parentElement) {
        grandParent.parentElement.style.height = "auto"; // 让它根据内容自动调整
        grandParent.parentElement.style.minHeight = "200px"; // 设置一个最小高度，避免过小
      
        // 让容器的高度自适应内容
        grandParent.parentElement.style.display = "flex";
        grandParent.parentElement.style.flexDirection = "column";

        wrapperContainer.style.display = "flex";
        grandParent.parentElement.appendChild(wrapperContainer);
      }
      // 创建 select 按钮
      const selectButton = document.createElement("div");
      selectButton.id = "select-button";
      selectButton.textContent = "select";
      selectButton.style.cursor = "pointer";
      selectButton.style.padding = "8px 16px";
      selectButton.style.backgroundColor = "#f0f0f0";
      selectButton.style.borderRadius = "4px";
      selectButton.style.display = "inline-block";
      selectButton.style.marginBottom = "16px";  // 添加下方的空白
      wrapperContainer.appendChild(selectButton);

      // 创建 export 按钮
      const exportButton = document.createElement("div");
      exportButton.id = "export-button";
      exportButton.textContent = "export";
      exportButton.style.cursor = "pointer";
      exportButton.style.padding = "8px 16px";
      exportButton.style.backgroundColor = "#f0f0f0";
      exportButton.style.borderRadius = "4px";
      exportButton.style.display = "inline-block";
      exportButton.style.marginBottom = "16px";  // 添加下方的空白
      wrapperContainer.appendChild(exportButton);

      // 创建全选框容器
      const selectAllContainer = document.createElement("div");
      selectAllContainer.id = "select-all-container";
      selectAllContainer.style.display = "flex";
      selectAllContainer.style.cursor = "pointer";


      // 创建全选框
      const selectAllCheckbox = document.createElement("input");
      selectAllCheckbox.type = "checkbox";
      selectAllCheckbox.id = "select-all";
      selectAllCheckbox.addEventListener("change", handleSelectAllChange);
      // 将全选框和标签添加到容器中
      selectAllContainer.appendChild(selectAllCheckbox);

      // 将全选框容器添加到新的容器中
      wrapperContainer.appendChild(selectAllContainer);
  
      // 创建菜单栏
      const exportMenu = createExportMenu(wrapperContainer,100);
      wrapperContainer.appendChild(exportMenu);

      const selectMenu = createSelectMenu(wrapperContainer,0);
      wrapperContainer.appendChild(selectMenu);
      
  
      // 点击 select 按钮显示菜单
      selectButton.addEventListener("click", () => {
        if (isSelectMode) {
          toggleSelectMode(false);
        } else {
          selectMenu.style.display = "block";
        }
      });
      exportButton.addEventListener("click",() => {
        exportMenu.style.display = "block";
      });
      // 点击外部隐藏菜单
      document.addEventListener("click", (event) => {
        if (!selectButton.contains(event.target as Node)) {
          selectMenu.style.display = "none";
        }
        if (!exportButton.contains(event.target as Node)) {
          exportMenu.style.display = "none";
        }
      });
    }
  }

};
// 初始加载
// addCheckboxToContent();
init();

// 监听 DOM 变化，确保新内容也有复选框
// const observer = new MutationObserver(() => {
//   addCheckboxToContent();
// });
// const config = { attributes: true, childList: true, subtree: true };
// observer.observe(document.body, config);