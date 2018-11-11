import React from 'react'
import { connect } from 'react-redux'
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row } from 'reactstrap';
import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs';

import './courses.css'

const defaultPrivateKey = "PW5KBLtvqR1DxWmLBHVnmHmHQKVNGiKLjy5Pbt1oAkiQn8Xkc4bgq"
// const signatureProvider = new JsSignatureProvider([defaultPrivateKey])
// const rpc = new JsonRpc('http://10.7.0.158:8888', { fetch });
// const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const Course = (props) => {

  const onClick = () => {
    console.log('click');
  }

  return (
    <Card className="course-card">
      <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
      <CardBody>
        <CardTitle>Card title</CardTitle>
        <CardSubtitle>Card subtitle</CardSubtitle>
        <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
        <Button onClick={onClick}>Button</Button>
      </CardBody>
    </Card>
  );
}

class CoursesPage extends React.Component {
  render() {
    const courses = [
      {
        title: 'Card Title 1',
        subtitle: 'Card subtitle',
        text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
        buttonText: 'button'
      },
      {
        title: 'Card Title 2',
        subtitle: 'Card subtitle',
        text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
        buttonText: 'button'
      },
      {
        title: 'Card Title 3',
        subtitle: 'Card subtitle',
        text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
        buttonText: 'button'
      }

    ]

    return (
      <div className="course-container">
        <Row>
          {courses.map((courseProps) => Course(courseProps))}
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPage)
