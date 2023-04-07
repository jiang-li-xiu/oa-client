// 初始化表单数据
export function initListenerForm(listener) {
  let self = {
    ...listener
  };
  if (listener.script) {
    self = {
      ...listener,
      ...listener.script,
      scriptType: listener.script.resource ? "externalScript" : "inlineScript"
    };
  }
  if (listener.event === "timeout" && listener.eventDefinitions) {
    if (listener.eventDefinitions.length) {
      let k = "";
      for (let key in listener.eventDefinitions[0]) {
        if (key.indexOf("time") !== -1) {
          k = key;
          self.eventDefinitionType = key.replace("time", "").toLowerCase();
        }
      }
      self.eventTimeDefinitions = listener.eventDefinitions[0][k].body;
    }
  }
  return self;
}

export function initListenerType(listener) {
  let listenerType;
  if (listener.class) listenerType = "classListener";
  if (listener.attrs) listenerType = "attrsListener";
  if (listener.expression) listenerType = "expressionListener";
  if (listener.delegateExpression) listenerType = "delegateExpressionListener";
  if (listener.script) listenerType = "scriptListener";
  let res = {
    ...JSON.parse(JSON.stringify(listener)),
    ...(listener.script ?? {}),
    listenerType: listenerType
  };
  if(listener.$attrs && listener.$attrs.id){
    res.id = listener.$attrs.id
  }
  return res
}

export const listenerType = {
  classListener: "Java 类",
  expressionListener: "表达式",
  delegateExpressionListener: "代理表达式",
  scriptListener: "脚本"
};

export const eventType = {
  create: "创建",
  assignment: "指派",
  complete: "完成",
  delete: "删除",
  update: "更新",
  timeout: "超时"
};

export const fieldType = {
  string: "字符串",
  expression: "表达式"
};