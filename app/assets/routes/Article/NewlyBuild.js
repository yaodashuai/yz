import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import React from 'react';
import { connect } from 'dva';
const qiniu = require('qiniu-js')
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Button,
    Tag,
    Tooltip,
    Icon,
    Radio,
    Modal,
    Upload
} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item
const { Option } = Select;
const QINIU_SERVER = 'http://up.qiniu.com'
const BASE_QINIU_URL ='http://qn.static.hikedu.com/'
import styles from './NewlyBuild.less';
@connect(({ newlybuild, loading }) => ({
    newlybuild,
    loading: loading.models.newlybuild,
}))
@Form.create()
export default class NewlyBuild extends React.Component {
    state = {
        tags: [],
        inputVisible: false,
        inputValue: '',
        previewVisible: false,
        previewImage: '',
        fileList:[]
    }
  submit = (e) => {
      const {  form } = this.props;
      form.validateFields((err, fieldsValue) => {
          if (err) return
          console.log(fieldsValue)
      })
  };
  componentDidMount(){
      const { dispatch } = this.props;
      dispatch({
          type:'newlybuild/fetchCategory',
          payload:{
              page:0,
              size:9999
          }
      })
      dispatch({
          type:'newlybuild/getToken',
      })
  };
  handleChange = (content) => {
    console.log(content)
  };
  handleRawChange = (rawContent) => {
    console.log(rawContent)
  };
  uploadFn = (param) => {
      const {newlybuild:{token}} = this.props
      const config = {
          useCdnDomain: true,
      };
      var putExtra = {
          fname:param.file.name,
      };
      const observer = {
          next(res){
              const {total} = res
              console.log(total)
              param.progress(total.loaded / total.size * 100)
          },
          error(err){
              param.error({
                  msg: err.message
              })
          },
          complete(res){
              param.success({
                  url: `http://qn.static.hikedu.com/${res.key}`
              })
          }
      }
      const observable = qiniu.upload(param.file, param.file.name, token, putExtra, config)
      const subscription = observable.subscribe(observer)
  }
    /**
     * 这是题图的渲染
     */
    handleCancel = () => this.setState({previewVisible: false})
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }
    handleUploadChange = ({file, fileList}) => {
        const {uid, name, type, thumbUrl, status, response = {}} = file
        const fileItem = {
            uid,
            name,
            type,
            thumbUrl,
            status,
            url: BASE_QINIU_URL + (response.key || '')
        }
        fileList.pop()
        fileList.push(fileItem)
        this.setState({fileList})
    }
  renderUpload =()=>{
      const {newlybuild:{token}} = this.props
      const {previewVisible, previewImage, fileList} = this.state
      const uploadProps = {
          action: QINIU_SERVER,
          data: {
              token: token
          },
          listType: 'picture-card',
          className: 'upload-list-inline',
          fileList,
          onPreview: this.handlePreview,
          onChange: this.handleUploadChange
      }
      const uploadButton = (
          <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
          </div>
      );
      return (
          <div>
              <Upload {...uploadProps}>
                  {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img style={{width: '100%'}} src={previewImage} />
              </Modal>
          </div>
      )
  }
    /**
     * 这是tag的函数
     * @returns {*}
     */
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }

    saveInputRef = input => this.input = input
  renderTag =()=>{
      const { tags, inputVisible, inputValue } = this.state;
      return(
          <div>
              {tags.map((tag, index) => {
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                      <Tag key={tag} closable={index !== 0} afterClose={() => this.handleClose(tag)}>
                          {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                      </Tag>
                  );
                  return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
              })}
              {inputVisible && (
                  <Input
                      ref={this.saveInputRef}
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={inputValue}
                      onChange={this.handleInputChange}
                      onBlur={this.handleInputConfirm}
                      onPressEnter={this.handleInputConfirm}
                  />
              )}
              {!inputVisible && (
                  <Tag
                      onClick={this.showInput}
                      style={{ background: '#fff', borderStyle: 'dashed' }}
                  >
                      <Icon type="plus" /> add tag
                  </Tag>
              )}
          </div>
      )
  }
  render() {
    const editorProps = {
      height: 500,
      contentFormat: 'html',
      onChange: this.handleChange,
      onRawChange: this.handleRawChange,
    }
      const {newlybuild:{category}} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Card title="新建文章" bordered={false}>
          <div className={styles.tableListForm}>
              <Form layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                      <FormItem label="文章标题">
                          {getFieldDecorator('no',{
                              rules: [{ required: true, message: '请填写文章标题' }]
                          })(<Input placeholder="请输入" />)}
                      </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                      <FormItem label="文章类别">
                          {getFieldDecorator('status',{
                              rules:[{required:true,message:'请选择文章类别'}]
                          })(
                              <Select placeholder="请选择" style={{ width: '100%' }}>
                                  {
                                      category.map((item) =>{
                                          return <Option value={`${item.id}`} key={item.id}>{item.name}</Option>
                                      })
                                  }
                              </Select>
                          )}
                      </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                      <FormItem label="文章标签">
                          {this.renderTag()}
                      </FormItem>
                  </Col>
              </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={8} sm={24}>
                          <FormItem label="文章摘要">
                              {getFieldDecorator('aa',{
                                  rules: [{ required: true, message: '请填写文章摘要' }]
                              })(<Input placeholder="请输入" />)}
                          </FormItem>
                      </Col>
                      <Col md={8} sm={24}>
                          <FormItem label="转载站名称">
                              {getFieldDecorator('a')(<Input placeholder="请输入" />)}
                          </FormItem>
                      </Col>
                      <Col md={8} sm={24}>
                          <FormItem label="转载地址">
                              {getFieldDecorator('b')(<Input placeholder="请输入" />)}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={8} sm={24}>
                          <FormItem label="发布状态">
                              {getFieldDecorator('bd',{
                                  rules: [{ required: true, message: '请选择发布状态' }]
                              })(
                                  <RadioGroup>
                                    <Radio value="b">草稿</Radio>
                                    <Radio value="c">发布</Radio>
                                  </RadioGroup>)}
                          </FormItem>
                      </Col>
                      <Col md={8} sm={24}>
                          <FormItem label="是否推荐">
                              {getFieldDecorator('bs',{
                                  rules: [{ required: true, message: '请选择是否推荐' }]
                              })(
                                  <RadioGroup>
                                      <Radio value="b">yes</Radio>
                                      <Radio value="c">no</Radio>
                                  </RadioGroup>)}
                          </FormItem>
                      </Col>
                      <Col md={8} sm={24}>
                          <FormItem label="文章题文">
                              {this.renderUpload()}
                          </FormItem>
                      </Col>
                  </Row>
          </Form>
          </div>
          <div className="demo">
          <BraftEditor {...editorProps} media={{uploadFn: this.uploadFn}} />
        </div>
        <Row className={styles.end}>
          <Button onClick={this.submit} type="primary">
            发表文章
          </Button>
        </Row>
      </Card>
    );
  }
}




