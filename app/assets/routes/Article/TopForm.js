import React, { PureComponent,Fragment  } from 'react';
import { Card, Button, Form,  Col, Row,Input, Divider, Modal, Popconfirm} from 'antd';
const { TextArea } = Input;
import styles from './style.less';
import { connect } from 'dva';
const fieldLabels = {
    name: '名称',
    code: '代码',
    describe: '描述',
};
@connect(({ classification, loading }) => ({
    classification,
    loading: loading.models.classification,
}))
@Form.create()
export default class TopForm extends PureComponent{
    state = {
        code:Math.random().toString().substr(2,10),
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                this.props.dispatch({
                    type:'classification/createSubmit',
                    payload:values
                })
            }
        });
    };
    render(){
        const { getFieldDecorator,  } = this.props.form;
        const {code} = this.state
        return(
            <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                    <Col lg={8} md={12} sm={24}>
                        <Form.Item label={fieldLabels.name}>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入名称' }],
                            })(<Input placeholder="请输入名称" />)}
                        </Form.Item>
                    </Col>
                    <Col lg={8} md={12} sm={24}>
                        <Form.Item label={fieldLabels.code}>
                            {getFieldDecorator('code',{
                                initialValue:code
                            },{
                            })(<Input placeholder="请输入代码" disabled={true} />)}
                        </Form.Item>
                    </Col>
                    <Col lg={8} md={12} sm={24}>
                        <Form.Item label={fieldLabels.describe}>
                            {getFieldDecorator('describe', {
                                rules: [{ required: true, message: '请输入描述' }],
                            })(<TextArea rows={4} placeholder="请输入描述" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Form.Item className={styles.button}>
                        <Button type="primary" onClick={this.handleSubmit}>
                            增加分类
                        </Button>
                    </Form.Item>
                </Row>
            </Form>

        )
    }
}

