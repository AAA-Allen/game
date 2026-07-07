export type Zone = {
  id: string;
  name: string;
  slug: string;
  description: string;
  requiredLevel: number;
  isUnlocked: boolean;
};

export type ValidationRule = {
  id: string;
  description: string;
  keywords: string[];
};

export type Level = {
  id: string;
  zoneId: string;
  chapter: string;
  sortOrder: number;
  title: string;
  subtitle: string;
  story: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  rewardXp: number;
  learningObjectives: string[];
  prerequisites: string[];
  knowledgePoints: string[];
  taskDescription: string[];
  passCriteria: string[];
  hintLevels: string[];
  starterCode: {
    html: string;
    css: string;
    javascript: string;
  };
  validationRules: ValidationRule[];
  requiredKeywords: string[];
};

export const zones: Zone[] = [
  {
    id: "zone-html",
    name: "新手村",
    slug: "html-beginner",
    description: "学习 HTML 结构、文本、链接、列表与表单，完成你的第一张网页名片。",
    requiredLevel: 1,
    isUnlocked: true,
  },
  {
    id: "zone-css",
    name: "CSS 森林",
    slug: "css-forest",
    description: "学习选择器、文本样式、卡片样式与盒模型，让页面真正好看起来。",
    requiredLevel: 2,
    isUnlocked: false,
  },
  {
    id: "zone-js",
    name: "JS 风暴",
    slug: "js-storm",
    description: "学习变量、函数、DOM 与交互逻辑，让页面拥有真正的生命。",
    requiredLevel: 4,
    isUnlocked: false,
  },
];

export const levels: Level[] = [
  {
    id: "level-001",
    zoneId: "zone-html",
    chapter: "第一章 新手村",
    sortOrder: 1,
    title: "认识网页骨架",
    subtitle: "搭建你的第一张冒险公告板",
    story:
      "你刚进入新手村，村口的公告板还是空的。村长让你把欢迎信息写上去，让所有来到 WebQuest 的冒险者都知道这里是旅程的起点。",
    description: "用 `main`、`h1` 和 `p` 搭起第一张网页公告板。",
    difficulty: "easy",
    rewardXp: 10,
    learningObjectives: [
      "认识网页正文的基本结构",
      "学会写出一个一级标题",
      "学会用段落展示说明文本",
    ],
    prerequisites: ["无"],
    knowledgePoints: ["<main>", "<h1>", "<p>"],
    taskDescription: [
      "在页面中创建一个一级标题",
      "在标题下方添加一段欢迎介绍文字",
      "所有内容放在主要内容区域中",
    ],
    passCriteria: [
      "存在 `<main>`",
      "存在 `<h1>`",
      "存在 `<p>`",
      "标题与段落位于主要内容区域中",
    ],
    hintLevels: [
      "网页正文内容通常需要一个主要容器。",
      "一级标题使用 `<h1>`，介绍文字通常使用 `<p>`。",
      "可以写成 `<main><h1>...</h1><p>...</p></main>`。",
    ],
    starterCode: {
      html: "<main>\n</main>",
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("WebQuest ready");',
    },
    validationRules: [
      {
        id: "main-structure",
        description: "页面需要有主要内容区、一级标题和段落。",
        keywords: ["<main", "<h1", "<p"],
      },
    ],
    requiredKeywords: ["<main", "<h1", "<p"],
  },
  {
    id: "level-002",
    zoneId: "zone-html",
    chapter: "第一章 新手村",
    sortOrder: 2,
    title: "文本标签入门",
    subtitle: "写出一份任务说明",
    story:
      "村长交给你第一份正式任务：制作一份任务说明书，让新人知道本次冒险的重点和注意事项。",
    description: "学习二级标题、段落和强调标签的基础用法。",
    difficulty: "easy",
    rewardXp: 12,
    learningObjectives: [
      "理解标题和正文的差异",
      "学会用 `strong` 强调重点",
      "学会用 `em` 表示特别提醒",
    ],
    prerequisites: ["认识网页骨架"],
    knowledgePoints: ["<h2>", "<p>", "<strong>", "<em>"],
    taskDescription: [
      "添加一个二级标题，作为任务标题",
      "添加两段说明文字",
      "在其中一段里用 `strong` 强调关键词",
      "在另一段里用 `em` 表示特别提醒",
    ],
    passCriteria: [
      "存在 `<h2>`",
      "至少存在两个 `<p>`",
      "使用了 `<strong>`",
      "使用了 `<em>`",
    ],
    hintLevels: [
      "较小层级标题可用 `<h2>`。",
      "重要内容可以用 `<strong>`。",
      "语气强调可以用 `<em>`。",
    ],
    starterCode: {
      html: "<main>\n  <h1>新手村公告</h1>\n</main>",
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("mission loaded");',
    },
    validationRules: [
      {
        id: "text-tags",
        description: "任务说明里需要有标题、段落和强调标签。",
        keywords: ["<h2", "<p", "<strong", "<em"],
      },
    ],
    requiredKeywords: ["<h2", "<p", "<strong", "<em"],
  },
  {
    id: "level-003",
    zoneId: "zone-html",
    chapter: "第一章 新手村",
    sortOrder: 3,
    title: "图片与链接",
    subtitle: "给冒险者档案补上头像与入口",
    story:
      "村里的档案馆需要为你的冒险者档案添加头像和资料入口，这样其他人就能快速认识你。",
    description: "学习插入图片、补充 `alt` 描述和创建超链接。",
    difficulty: "easy",
    rewardXp: 14,
    learningObjectives: [
      "学会插入图片",
      "理解 `alt` 的作用",
      "学会创建超链接",
    ],
    prerequisites: ["认识网页骨架", "文本标签入门"],
    knowledgePoints: ["<img>", "src", "alt", "<a>", "href"],
    taskDescription: [
      "添加一张头像图片",
      "图片必须包含 `alt` 描述",
      "添加一个跳转到个人主页或作品页的链接",
    ],
    passCriteria: [
      "存在 `<img>`",
      "图片具有 `src`",
      "图片具有 `alt`",
      "存在 `<a>`",
      "链接具有 `href`",
    ],
    hintLevels: [
      "图片标签不需要闭合内容。",
      "`alt` 用来描述图片含义。",
      "链接标签格式是 `<a href=\"...\">文本</a>`。",
    ],
    starterCode: {
      html: "<main>\n  <h1>我的冒险者档案</h1>\n  <p>欢迎来到 WebQuest。</p>\n</main>",
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("profile ready");',
    },
    validationRules: [
      {
        id: "media-link",
        description: "页面需要同时包含图片和链接。",
        keywords: ["<img", "src=", "alt=", "<a", "href="],
      },
    ],
    requiredKeywords: ["<img", "src=", "alt=", "<a", "href="],
  },
  {
    id: "level-004",
    zoneId: "zone-html",
    chapter: "第一章 新手村",
    sortOrder: 4,
    title: "列表与信息分组",
    subtitle: "整理你的技能清单",
    story:
      "村里的导师要求你把自己的初始技能整理成清单，便于后续升级记录。",
    description: "用 `section`、`div`、`ul` 和 `li` 组织结构化信息。",
    difficulty: "easy",
    rewardXp: 16,
    learningObjectives: [
      "学会用列表组织重复信息",
      "学会使用容器对内容分组",
      "理解区域与列表的组合关系",
    ],
    prerequisites: ["前 3 关"],
    knowledgePoints: ["<section>", "<ul>", "<li>", "<div>"],
    taskDescription: [
      "创建一个技能区域",
      "在区域中放一个无序列表",
      "列出至少 3 项技能",
      "使用容器把标题和列表归为一组",
    ],
    passCriteria: [
      "存在 `<section>`",
      "存在 `<ul>`",
      "至少存在 3 个 `<li>`",
      "使用了 `<div>` 或其他有效容器做信息分组",
    ],
    hintLevels: [
      "一组相关信息可以放在 `section` 里。",
      "无序列表使用 `ul` 和 `li`。",
      "每一项技能都需要单独一个 `li`。",
    ],
    starterCode: {
      html: "<main>\n  <h1>冒险者技能档案</h1>\n</main>",
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("skills ready");',
    },
    validationRules: [
      {
        id: "list-grouping",
        description: "技能区域需要有列表和分组容器。",
        keywords: ["<section", "<ul", "<li", "<div"],
      },
    ],
    requiredKeywords: ["<section", "<ul", "<li", "<div"],
  },
  {
    id: "level-005",
    zoneId: "zone-html",
    chapter: "第一章 新手村",
    sortOrder: 5,
    title: "表单与输入控件",
    subtitle: "制作入村登记表",
    story:
      "你已经完成基础训练，守门员要求你制作一张入村登记表，记录每位冒险者的名字和职业。",
    description: "学习 `form`、`label`、`input` 和 `button` 的配合用法。",
    difficulty: "medium",
    rewardXp: 18,
    learningObjectives: [
      "认识表单的基本作用",
      "学会使用输入框和按钮",
      "理解标签与输入项之间的对应关系",
    ],
    prerequisites: ["前 4 关"],
    knowledgePoints: ["<form>", "<label>", "<input>", "<button>"],
    taskDescription: [
      "创建一个表单",
      "添加姓名输入框",
      "添加职业输入框",
      "为输入框添加文字说明",
      "添加一个提交按钮",
    ],
    passCriteria: [
      "存在 `<form>`",
      "至少存在 2 个 `<input>`",
      "至少存在 1 个 `<label>`",
      "存在 `<button>`",
    ],
    hintLevels: [
      "收集用户输入需要使用 `form`。",
      "输入框通常要配一个 `label` 提示用途。",
      "按钮可以写成 `<button type=\"submit\">提交</button>`。",
    ],
    starterCode: {
      html: "<main>\n  <h1>新手村登记处</h1>\n</main>",
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("register form");',
    },
    validationRules: [
      {
        id: "basic-form",
        description: "登记表需要有表单、输入项和提交按钮。",
        keywords: ["<form", "<label", "<input", "<button"],
      },
    ],
    requiredKeywords: ["<form", "<label", "<input", "<button"],
  },
  {
    id: "level-006",
    zoneId: "zone-html",
    chapter: "第一章 新手村",
    sortOrder: 6,
    title: "Boss - 个人介绍页",
    subtitle: "发布你的第一张冒险者名片",
    story:
      "为了正式加入 WebQuest 冒险者公会，你需要提交一份个人介绍页，展示自己的身份、目标和掌握的初始技能。",
    description: "综合前 5 关 HTML 知识，完成一张完整的冒险者介绍页。",
    difficulty: "hard",
    rewardXp: 25,
    learningObjectives: [
      "综合使用标题、段落、图片、链接和列表",
      "完成一个完整的静态页面",
      "为后续 CSS 章节做结构准备",
    ],
    prerequisites: ["第一章前 5 关"],
    knowledgePoints: ["标题", "段落", "图片", "链接", "列表"],
    taskDescription: [
      "创建页面主标题",
      "添加头像图片",
      "添加一段个人简介",
      "添加技能列表",
      "添加一个联系方式链接",
    ],
    passCriteria: [
      "存在 `<h1>`",
      "存在 `<img alt>`",
      "存在至少 1 个 `<p>`",
      "存在 `<ul>` 且至少 3 个 `<li>`",
      "存在 `<a href>`",
    ],
    hintLevels: [
      "先搭结构，再逐块补内容。",
      "可以按“头像 -> 简介 -> 技能 -> 联系方式”的顺序组织。",
      "把每部分内容都放在语义清晰的区域中。",
    ],
    starterCode: {
      html: "<main>\n</main>",
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("profile page start");',
    },
    validationRules: [
      {
        id: "profile-page",
        description: "介绍页需要具备完整的个人名片信息。",
        keywords: ["<h1", "<img", "alt=", "<ul", "<li", "<a", "href="],
      },
    ],
    requiredKeywords: ["<h1", "<img", "alt=", "<ul", "<li", "<a", "href="],
  },
  {
    id: "level-007",
    zoneId: "zone-css",
    chapter: "第二章 CSS 森林",
    sortOrder: 7,
    title: "CSS 选择器入门",
    subtitle: "让公告板真正拥有样式",
    story:
      "新手村的公告板内容已经写好，但看起来太普通了。你需要用样式让重要信息更容易被看到。",
    description: "学习标签选择器、类选择器以及颜色、背景色的基础写法。",
    difficulty: "easy",
    rewardXp: 12,
    learningObjectives: [
      "认识 CSS 的基本写法",
      "学会使用标签选择器和类选择器",
      "让页面元素发生可见变化",
    ],
    prerequisites: ["第一章全部关卡"],
    knowledgePoints: ["选择器", "color", "background-color", "类名绑定"],
    taskDescription: [
      "给页面标题设置颜色",
      "给一个内容区域添加背景色",
      "至少给一个元素添加类名并在 CSS 中选中它",
    ],
    passCriteria: [
      "使用了 CSS 规则",
      "至少出现一个类选择器",
      "至少设置 1 个文字颜色和 1 个背景色",
    ],
    hintLevels: [
      "类选择器以 `.` 开头。",
      "标题可以直接使用标签选择器。",
      "背景色通常设置在容器元素上。",
    ],
    starterCode: {
      html: '<main class="board">\n  <h1>新手村公告板</h1>\n  <p>欢迎来到 WebQuest。</p>\n</main>',
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("css start");',
    },
    validationRules: [
      {
        id: "selector-color",
        description: "页面需要用选择器命中元素并设置颜色。",
        keywords: [".board", "color", "background-color"],
      },
    ],
    requiredKeywords: [".board", "color", "background-color"],
  },
  {
    id: "level-008",
    zoneId: "zone-css",
    chapter: "第二章 CSS 森林",
    sortOrder: 8,
    title: "字体与文本样式",
    subtitle: "让任务说明更清晰",
    story:
      "导师发现你的任务说明文字太平淡了，阅读起来费劲。他要求你优化标题和正文，让信息层级更清晰。",
    description: "用字号、字重、对齐和行高建立信息层级。",
    difficulty: "easy",
    rewardXp: 14,
    learningObjectives: [
      "调整字号、字重和对齐方式",
      "理解文字样式对信息层级的影响",
      "提升长段落的可读性",
    ],
    prerequisites: ["CSS 选择器入门"],
    knowledgePoints: ["font-size", "font-weight", "text-align", "line-height"],
    taskDescription: [
      "增大标题字号",
      "提高标题字重",
      "调整正文行高",
      "让标题或某个区域居中显示",
    ],
    passCriteria: [
      "使用 `font-size`",
      "使用 `font-weight`",
      "使用 `line-height`",
      "使用 `text-align`",
    ],
    hintLevels: [
      "标题与正文应该有明显视觉差异。",
      "长段落通常需要更好的行高。",
      "居中可用 `text-align: center;`。",
    ],
    starterCode: {
      html: '<main class="mission-card">\n  <h1>今日任务</h1>\n  <p>完成一份清晰易读的任务说明。</p>\n</main>',
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("text styles");',
    },
    validationRules: [
      {
        id: "text-style",
        description: "任务卡需要建立清晰的文字层级。",
        keywords: ["font-size", "font-weight", "text-align", "line-height"],
      },
    ],
    requiredKeywords: ["font-size", "font-weight", "text-align", "line-height"],
  },
  {
    id: "level-009",
    zoneId: "zone-css",
    chapter: "第二章 CSS 森林",
    sortOrder: 9,
    title: "背景与边框",
    subtitle: "制作一张任务卡片",
    story:
      "公告内容有了，但村里的任务卡片还是像普通文字一样散在页面里。你需要给它做出真正的“卡片感”。",
    description: "学习背景、边框和圆角，让内容区域更像一个组件。",
    difficulty: "easy",
    rewardXp: 16,
    learningObjectives: [
      "理解背景、边框和圆角的基础作用",
      "能做出具有卡片感的界面",
      "为后续盒模型调整做准备",
    ],
    prerequisites: ["CSS 选择器入门", "字体与文本样式"],
    knowledgePoints: ["background", "border", "border-radius", "box-shadow"],
    taskDescription: [
      "为卡片区域设置背景色",
      "添加边框",
      "增加圆角",
      "可选：增加阴影让卡片更立体",
    ],
    passCriteria: [
      "使用 `background` 或 `background-color`",
      "使用 `border`",
      "使用 `border-radius`",
    ],
    hintLevels: [
      "先找到卡片容器元素。",
      "边框和背景一起用，卡片感更明显。",
      "圆角会让界面更柔和。",
    ],
    starterCode: {
      html: '<main>\n  <section class="task-card">\n    <h1>主线任务</h1>\n    <p>完成你的第一张冒险任务卡。</p>\n  </section>\n</main>',
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: 'console.log("card ready");',
    },
    validationRules: [
      {
        id: "card-shell",
        description: "卡片需要具备背景、边框和圆角。",
        keywords: ["background", "border", "border-radius"],
      },
    ],
    requiredKeywords: ["background", "border", "border-radius"],
  },
  {
    id: "level-010",
    zoneId: "zone-css",
    chapter: "第二章 CSS 森林",
    sortOrder: 10,
    title: "盒模型与间距",
    subtitle: "让页面不再拥挤",
    story:
      "任务卡已经做出来了，但里面的文字紧贴边框，多个模块之间也毫无间隔。导师要求你调整布局，让内容更易读。",
    description: "学习 `padding`、`margin` 和宽度控制，让卡片更有呼吸感。",
    difficulty: "medium",
    rewardXp: 18,
    learningObjectives: [
      "理解 `padding` 和 `margin` 的区别",
      "知道元素大小和间距对阅读体验的影响",
      "学会控制卡片宽度",
    ],
    prerequisites: ["背景与边框"],
    knowledgePoints: ["width", "padding", "margin", "盒模型"],
    taskDescription: [
      "为卡片内容增加内边距",
      "让卡片与页面边缘保持距离",
      "控制卡片宽度，不要铺满整个页面",
    ],
    passCriteria: [
      "使用 `padding`",
      "使用 `margin`",
      "使用 `width` 或 `max-width`",
    ],
    hintLevels: [
      "内边距影响内容和边框的距离。",
      "外边距影响元素和外部的距离。",
      "卡片不一定要占满整行。",
    ],
    starterCode: {
      html: '<main>\n  <section class="task-card">\n    <h1>冒险提示</h1>\n    <p>请调整卡片的间距，让页面更清晰。</p>\n  </section>\n</main>',
      css: "body {\n  font-family: sans-serif;\n}\n\n.task-card {\n  border: 1px solid #333;\n  border-radius: 12px;\n}",
      javascript: 'console.log("spacing challenge");',
    },
    validationRules: [
      {
        id: "spacing-model",
        description: "卡片需要有合理的宽度和内外边距。",
        keywords: ["padding", "margin", "width"],
      },
    ],
    requiredKeywords: ["padding", "margin", "width"],
  },
  {
    id: "level-011",
    zoneId: "zone-css",
    chapter: "第二章 CSS 森林",
    sortOrder: 11,
    title: "display 与元素排布",
    subtitle: "整理标签徽章的展示方式",
    story:
      "你制作了一组“技能徽章”，但它们现在挤在一起或换行混乱。你需要调整它们的显示方式。",
    description: "学习用 `display` 控制元素是独占一行还是横向排布。",
    difficulty: "medium",
    rewardXp: 20,
    learningObjectives: [
      "理解块级与行内元素的基础区别",
      "学会用 `inline-block` 或其他 display 值控制排布",
      "让标签元素更像真实徽章",
    ],
    prerequisites: ["盒模型与间距"],
    knowledgePoints: ["display: block", "display: inline", "display: inline-block"],
    taskDescription: [
      "制作至少 3 个技能标签",
      "让这些标签横向展示",
      "每个标签保持自己的边框和背景",
    ],
    passCriteria: [
      "至少存在 3 个标签元素",
      "使用 `display`",
      "标签能被设置成适合横向排布的形式",
    ],
    hintLevels: [
      "默认块级元素会独占一行。",
      "如果既想横向排列又想保留尺寸控制，可以尝试 `inline-block`。",
      "为每个徽章加一点 `padding` 会更像标签。",
    ],
    starterCode: {
      html: '<main>\n  <div class="badge">HTML</div>\n  <div class="badge">CSS</div>\n  <div class="badge">JavaScript</div>\n</main>',
      css: "body {\n  font-family: sans-serif;\n}\n\n.badge {\n  border: 1px solid #333;\n  border-radius: 999px;\n  padding: 6px 12px;\n}",
      javascript: 'console.log("badge layout");',
    },
    validationRules: [
      {
        id: "badge-display",
        description: "徽章需要用 display 进行横向排布。",
        keywords: [".badge", "display", "inline-block"],
      },
    ],
    requiredKeywords: [".badge", "display", "inline-block"],
  },
  {
    id: "level-012",
    zoneId: "zone-css",
    chapter: "第二章 CSS 森林",
    sortOrder: 12,
    title: "Boss - 个人资料卡片美化",
    subtitle: "把你的冒险者档案升级成正式名片",
    story:
      "公会管理员已经收到你的个人介绍页，但他说：“内容合格，表现力不足。” 现在你需要把这份资料页升级成真正能展示给全村看的冒险者名片。",
    description: "综合第二章全部样式知识，把资料页升级成一张完整的产品化卡片。",
    difficulty: "hard",
    rewardXp: 30,
    learningObjectives: [
      "综合使用第二章全部核心样式能力",
      "将第一章的 HTML 内容升级为美观的资料卡片",
      "为后续布局关卡建立视觉基础",
    ],
    prerequisites: ["第二章前 5 关", "第一章 Boss 关"],
    knowledgePoints: [
      "选择器",
      "字体与文本样式",
      "背景、边框、圆角",
      "margin、padding、宽度控制",
      "display 基础使用",
    ],
    taskDescription: [
      "让页面主卡片具有背景、边框和圆角",
      "调整标题和正文的字号与层级",
      "为头像、技能列表和链接区域做出更清晰的排布",
      "至少让技能标签具备可辨识的视觉样式",
    ],
    passCriteria: [
      "主卡片存在背景、边框、圆角",
      "页面使用了文字样式属性",
      "页面使用了内外边距",
      "技能标签使用了 `display` 控制",
      "页面整体具备卡片化视觉结构",
    ],
    hintLevels: [
      "先确定“页面主卡片”是哪一个容器。",
      "标题、简介、标签和链接区应该有不同的视觉层级。",
      "先保证结构清晰，再去做美化。",
    ],
    starterCode: {
      html: '<main class="profile-card">\n  <img src="https://dummyimage.com/120x120/cccccc/000000" alt="冒险者头像" />\n  <h1>代码冒险家</h1>\n  <p>正在学习 HTML 和 CSS，准备开启更深入的前端旅程。</p>\n\n  <section class="skills">\n    <h2>已掌握技能</h2>\n    <div class="badge">HTML</div>\n    <div class="badge">CSS</div>\n    <div class="badge">Git</div>\n  </section>\n\n  <a href="https://example.com">查看我的作品</a>\n</main>',
      css: "body {\n  font-family: sans-serif;\n}\n\n.badge {\n  border: 1px solid #333;\n  border-radius: 999px;\n}",
      javascript: 'console.log("css boss");',
    },
    validationRules: [
      {
        id: "profile-card-shell",
        description: "主卡片需要具备基础视觉样式。",
        keywords: ["background", "border", "border-radius"],
      },
      {
        id: "profile-card-spacing",
        description: "卡片需要有清晰的内外边距和宽度控制。",
        keywords: ["padding", "margin", "width"],
      },
      {
        id: "profile-card-badges",
        description: "技能标签需要有 display 控制和卡片化展示。",
        keywords: ["display", ".badge"],
      },
    ],
    requiredKeywords: [
      "background",
      "border",
      "border-radius",
      "padding",
      "margin",
      "display",
    ],
  },
];
