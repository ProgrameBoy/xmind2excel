var xmind = require('xmind');
var fs = require('fs');
const moment = require('moment')

var testsuit = []

function readXmind(file) {
    // open xmind file
    var workbook = xmind.open(file);
    // get the primary sheet
    var sheet = workbook.getPrimarySheet();
    // get the root topic
    // rootTopic = sheet.rootTopic;
    // topic = rootTopic.getTitle()
    // return (rootTopic.toJSON())// 返回解析后的xmind文件
    return sheet.rootTopic.toJSON();
}

function parts2steps(parts) {
    var steps = [];
    var step = {};
    for (var i = 0; i < parts.length; i++) {
        // part 为 前置条件，添加到 steps 里
        if (parts[i]['condition']) {
            step['condition'] = parts[i]['condition']
        } else if (parts[i]['action']) { // part 为 测试步骤
            step['action'] = parts[i]['action']
            // 如果有下一个 part，且不是 预期结果，则该步骤结束，添加到 steps 里，初始化 step
            if ((i + 1 < parts.length) && (!parts[i + 1]['expected'])) {
                steps.push(step)
                step = {}
            }
        } else if (parts[i]['expected']) {// part 为 预期结果/用例属性，添加到 steps 里，该步骤结束，初始化 step
            step['expected'] = parts[i]['expected']
            steps.push(step)
            step = {}
        } else if (parts[i]['attribute']) {
            step['attribute'] = parts[i]['attribute']
            steps.push(step)
            step = {}
        }
    }

    return steps;
}


function zero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
function testsuit2excel(tags = '') {
    let num = 0
    var data = [
        ['功能模块与路径', '用例编号', '前置条件', '用例名称', '操作步骤', '预期结果', '标记', '优先级', '用例属性', '编制人员', '用例设计时间', '备注']
    ]
    for (let testcase of testsuit) {
        if (!testcase['steps'][0]) continue;
        let tc = [testcase['module'], 's_' + zero(num++, 3), testcase['steps'][0]['condition'], testcase['title'], testcase['steps'][0]['action'] || '', testcase['steps'][0]['expected'], tags, testcase['priority'] || '3', testcase.steps[0].attribute || '', '', moment(new Date).format('YYYY-MM-DD'), '']
        data.push(tc)
        for (let step of testcase['steps'].slice(1)) {
            data.push(['', '', '', '', step['action'], '', '', '', '', '', '', ''])
            if (step['condition']) {
                tc.splice(2, 1, step['condition'])
            }
            if (step['expected']) {
                tc.splice(5, 1, step['expected'])
            }
            if (step['attribute']) {
                tc.splice(8, 1, step['attribute'])
            }
        }
    }
    return data;
}

function json2testsuit(data, module = '') {
    children = data['children']
    // 如果没有子节点(即子节点为0),则本节点为步骤部件(前置条件/测试步骤/预期结果/优先级)
    if (children.length == 0) {
        let part = {
            'condition': '',
            'action': '',
            'expected': '',
            'priority': '',
            "attribute":''
        }
        let title = data['title']
        // 根据标题开头字段判断此部件类型(前置条件/测试步骤/预期结果)
        if (title.indexOf("前置条件") == 0) {
            part["condition"] = title.substr(5)
        } else if (title.indexOf("预期结果") == 0) {
            part["expected"] = title.substr(5)
        } else if (title.indexOf("优先级") == 0) {
            part["priority"] = title.substr(4)
        } else if (title.indexOf('用例属性') === 0) {
            part['attribute'] = title.substr(5);
        } else {
            part["action"] = title
        }
        // console.log("parat:\n",part)
        return part;

    } else { // 有子节点时
        let testcase = { 'title': data['title'] }
        let parts = []  
        for (let d of children) {
            // 如果子节点是步骤部件，则本节点是测试标题
            if (d['children'].length == 0) {
               let part = json2testsuit(d)
            //    console.log('case part:\n', part)
                if (part['priority']) {
                    testcase['priority'] = part['priority']
                } else {
                    parts.push(part)
                    // console.log('parts1:\n', parts)
                }
            }
            // 如果子节点还有子节点，继续爬行
            else {
                let m = module + '\\' + data['title']
                // for (let d of children) {
                    // console.log("dddd",d)
                    json2testsuit(d, m)
                // }
            }
        }
        if (parts.length !== 0){
            testcase['steps'] = parts2steps(parts)
            testcase['module'] = module
            testsuit.push(testcase)
        }
    }
}

function excelJSON(data) {
    var headTitle = data.splice(0, 1)[0];
    var retData = [];
    data.forEach((item, index) => {
        var obj = {};
        item.forEach((cItem, cIndex) => {
            obj[headTitle[cIndex]] = cItem;
        })
        retData.push(obj)
    })
    return retData;
}

var x2e = function (xmindFile, tags, excelFile) {
    testsuit = [];
    try {
        var data = readXmind(xmindFile)
        data = JSON.parse(data);
        // console.log(JSON.stringify(data))
        // return data;
        json2testsuit(data, '');
        data = testsuit2excel(tags);
        return excelJSON(data);
    } catch (err) {
        console.log(err)
        // reject('处理 xmind 错误')
        // console.log(err)
        return false;
    }
    //})
}
module.exports.x2e = x2e;
