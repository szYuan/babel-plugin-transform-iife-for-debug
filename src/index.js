const DEFAULT_OPT= {
    targetFlag: '@IIFE-for-debug',
    // 处理开关：默认true，关掉则不对源码做处理
    enableCondition: () => true,
    // 转换条件开关：对已经找到的目标函数进行判断，对满足条件的函数转成自执行函数，不满足条件的则删除函数代码块
    transformCondition: () => process.env.NODE_ENV==='development'
}
let options = null;

module.exports = function DebugBlock({ types: t }) {
    return {
        visitor: {
            Program(p, state) {
                options = getOptions(state.opts);
                if(options.enableCondition()) {
                    p.traverse({
                        FunctionDeclaration(path) {
                            return handler(path, path, t)
                        },
                        ArrowFunctionExpression(path) {
                            let expStm = path.parentPath;
                            // 箭头函数父级ExpressionStatement的leadingComments
                            return handler(expStm, path, t);
                        }
                    });
                }
            },
        }
    };
}

// checkCommentPath: 用来检查注释的节点path
// targetPath：用来处理的path
function handler(checkCommentPath, targetPath, t) {
    try {
        if(checkCommentPath && checkCommentPath.node) {
            let lc = checkCommentPath.node.leadingComments || [];
            if(lc.length) {
                lastComment = lc[lc.length - 1];
                if(isTargetFlag(lastComment.value)) {
                    // 注释与箭头函数位置紧挨在一起
                    if(isSticked(lastComment, targetPath.node)) {
                        if(isTransformCondition()) {
                            // 默认情况假设targetPath为箭头函数，或者由函数声明被括号包起来而变成的函数表达式，他们本身就是expression
                            let calleeExpression = targetPath.node;
                            // 如果是targetPath函数声明，则转换成函数表达式：为了放入CallExpression内
                            if(t.isFunctionDeclaration(targetPath.node)) {
                                let targetNode = targetPath.node;
                                targetPath.replaceWith(t.functionExpression(targetNode.id, targetNode.params, targetNode.body));
                                // targetPath被生成的functionExpression替代后，type可能还是expressionStatement，需要使用他的expression作为callee
                                if(t.isExpressionStatement(targetPath.node)) {
                                    calleeExpression = targetPath.node.expression;
                                }else {
                                    // 暂时未知的其他情况：
                                    // 作为FunctionDelaration的targetPath，
                                    // 被使用FunctionExpression调用replaceWith后，
                                    // targetPath变成了ExpressiontStatement外的其他类型
                                    console.warn('FunctionDelaration被repalce后，变成了ExpressiontStatement外的其他类型')
                                }
                            }
                            // 是调试环境，箭头函数转自执行
                            let IIFE_Expression = t.callExpression(calleeExpression, []);
                            let IIFE_Statement = t.expressionStatement(IIFE_Expression)
                            checkCommentPath.replaceWith(IIFE_Statement);
                        }else {
                            // 非调试环境，删除该调试函数
                            checkCommentPath.remove();
                        }
                    }
                }
            }
        }
    }catch(e) {
        console.warn('[IIFE-for-debug Exception]: ', e);
    }
}

function getOptions(stateOpt = {}) {
    return {
        ...DEFAULT_OPT,
        ...stateOpt
    }
}

function isTransformCondition() {
    // console.log(options.transformCondition())
    return options.transformCondition();
}

function isTargetFlag(comment) {
    try {
        return (comment.trim() === options.targetFlag)
    }catch(e) {
        return false;
    }
}

function isSticked(commentNode, arrowFunctionNode) {
    let result = false;
    // console.log(lastComment.loc.end.line, path.node.loc.start.line)
    if(commentNode && arrowFunctionNode) {
        if(commentNode.loc && arrowFunctionNode.loc) {
            if(commentNode.loc.end && arrowFunctionNode.loc.start) {
                result = (lastComment.loc.end.line + 1) === arrowFunctionNode.loc.start.line
            }
        }
    }
    return result;
}