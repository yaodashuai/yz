import React, { PureComponent,Fragment  } from 'react';
import { Card, Button, Form,  Col, Row,Input, Divider, Modal, Popconfirm} from 'antd';
const FormItem = Form.Item;
import { connect } from 'dva';
import TopForm from './TopForm'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import styles from './style.less';

const { TextArea } = Input;

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
export default class Classification extends PureComponent {
  state = {
      width: '100%',
      selectedRows:[],
      visible: false
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
      const { dispatch } = this.props;
      dispatch({
          type: 'classification/fetch',
          payload:{
              page:0,
              size:10
          }
      });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
       this.props.dispatch({
          type:'classification/createSubmit',
           payload:values
       })
      }
    });
  };
    /**
     * 模态框
     */
    showModal = (record) => {
        localStorage.setItem('categoryId',record.id)
      const {dispatch} = this.props
        dispatch({
            type:'classification/getContent',
            payload:{
                articleCategoryId:record.id
            }
        })
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        const categoryId = Number.parseInt(localStorage.getItem('categoryId'))
        e.preventDefault()
        const {dispatch} = this.props
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                dispatch({
                    type:'classification/update',
                    payload:{
                        ...values,
                        categoryId
                    }
                })
            }
        });
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
      console.log(pagination, filtersArg, sorter)
        const { dispatch } = this.props;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            page: pagination.current - 1,
            size: pagination.pageSize,
            // ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'classification/fetch',
            payload:params
        });
    }
    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }
    renderForm = () =>{
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
      const {contentDate} =this.props.classification
      const {getFieldDecorator} = this.props.form
        return(
            <Form onSubmit={this.handleOk} className="login-form">
                <FormItem label="文章名称"{...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue:contentDate.name,
                        rules: [{ required: true, message: 'Please input your name!' }],
                    })(
                        <Input  />
                    )}
                </FormItem>
                <FormItem label="文章标识"{...formItemLayout}>
                    {getFieldDecorator('code', {
                        initialValue:contentDate.code,
                        rules: [{ required: true, message: 'Please input your code!' }],
                    })(
                        <Input  />
                    )}
                </FormItem>
            </Form>
        )
    }
    removeItem =(record) =>{
    this.props.dispatch({
        type:'classification/removeItem',
        payload:{
            articleCategoryId:record.id
        }
                        })
}
  render() {

      const columns = [
          {
              title: '名称',
              dataIndex: 'name',
          },
          {
              title: '代码',
              dataIndex: 'code',
          },
          {
              title:'创建时间',
              dataIndex:'createdAt',
          },
          {
              title:'操作',
              render: (text, record) => (
                  <Fragment>
                      <a onClick={()=>{
                          this.showModal(record)
                      }}>编辑</a>
                      <Modal
                          title="分类详情"
                          visible={this.state.visible}
                          onOk={this.handleOk}
                          onCancel={this.handleCancel}
                      >
                          {this.renderForm()}
                      </Modal>
                      <Divider type="vertical" />
                      <Popconfirm title="确认删除吗？" onConfirm={()=>{
                          this.removeItem(record)
                      }} okText="yes" cancelText="No">
                          <a >删除</a>
                      </Popconfirm>
                  </Fragment>
              ),
          }
      ]


      const { form, dispatch, classification: { data },loading } = this.props;
        const { getFieldDecorator,  } = form;
    const {  code ,selectedRows} = this.state;
    data && data.list && data.list.map((item) =>{
        item.key = item.id
    })
    return (
      <PageHeaderLayout wrapperClassName={styles.advancedForm}>
        <Card title="分类" className={styles.card} bordered={false}>
            <TopForm />
        </Card>
        <Card title="分类列表" bordered={false}>
            <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
            />
        </Card>
      </PageHeaderLayout>
    );
  }
}

