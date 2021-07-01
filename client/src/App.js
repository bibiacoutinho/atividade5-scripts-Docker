import React from "react";
import {
  Container,
  Row,
  Col,
  Label,
  Input,
  FormGroup,
  Button,
  Alert,
} from "reactstrap";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      a: "",
      b: "",
      resultado: "",
      erro: "",
      msgExcluir: "",
      logs: []
    };
  }

  componentDidMount() {
    this.getLogs();
  }

  getLogs = () => {
    fetch('http://localhost:3101/log')
      .then((r) => r.text())
      .then((r) => JSON.parse(r))
      .then((r) => {
        this.setState({ logs: r.result })
      })
      .catch((e) =>
        this.setState({
          erro: e.message,
        })
      );
  };

  calcular = (op) => {
    if (this.state.a === "" || this.state.b === "") {
      this.setState({
        erro: "Forneça os operandos",
        resultado: "",
        msgExcluir: ''
      });
    } else {
      fetch(`http://localhost:3101/log/${this.state.a}/${this.state.b}/${op}`)
        .then((r) => r.text())
        .then((r) => JSON.parse(r))
        .then((r) => {
          if (r.result) {
            this.setState({
              erro: "",
              resultado: r.result,
              msgExcluir: ''
            });
            this.getLogs();
          } else {
            this.setState({
              erro: r.erro,
              resultado: "",
              msgExcluir: ''
            });
          }
        })
        .catch((e) =>
          this.setState({
            erro: e.message,
            resultado: "",
            msgExcluir: ''
          })
        );
    }
  };

  excluir = (e, idLog) => {
    e.preventDefault()
    fetch(`http://localhost:3101/log/${idLog}`)
      .then((r) => r.text())
      .then((r) => JSON.parse(r))
      .then((r) => {
        if (r.result) {
          this.setState({
            msgExcluir: r.result,
            erro: ''
          });
          this.getLogs();
        } else {
          this.setState({
            erro: r.erro,
            msgExcluir: ''
          });
        }
      })
      .catch((e) =>
        this.setState({
          erro: e.message,
          resultado: "",
        })
      );
  }

  render() {
    const lista = this.state.logs.map(item =>
      <div key={item.idlog} onContextMenu={e => this.excluir(e, item.idlog)}>{item.operacao} ({item.horario})</div>
    )
    return (
      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col className="border col-sm-3 col-md-3 col-lg-2 mr-2">
            <FormGroup style={{ padding: 5 }}>
              <Label>Operando</Label>
              <Input
                type="text"
                placeholder="número"
                className="text-right"
                value={this.state.a}
                onChange={(e) =>
                  this.setState({ a: e.target.value.replace(/\D/, "") })
                }
              />
            </FormGroup>
          </Col>
          <Col
            className="border col-sm-3 col-md-3 col-lg-2"
            style={{ marginRight: 5, marginLeft: 5 }}
          >
            <FormGroup style={{ padding: 5 }}>
              <Label>Operando</Label>
              <Input
                type="text"
                placeholder="número"
                className="text-right"
                value={this.state.b}
                onChange={(e) =>
                  this.setState({ b: e.target.value.replace(/\D/, "") })
                }
              />
            </FormGroup>
          </Col>
          <Col className="border col-sm-3 col-md-3 col-lg-2">
            <FormGroup style={{ padding: 5 }}>
              <Label>Resultado</Label>
              <Input
                type="text"
                placeholder="número"
                className="text-right"
                value={this.state.resultado}
                disabled
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-center mt-2">
          <Col className="border col-sm-9 col-md-9 col-lg-6 pt-2 pb-2">
            <FormGroup style={{ paddingTop: 5, paddingBottom: 5 }}>
              <Label>Operações:</Label>
              <Button
                color="secondary"
                style={{ marginRight: 5, marginLeft: 5 }}
                onClick={() => this.calcular("+")}
              >
                +
              </Button>
              <Button
                color="secondary"
                style={{ marginRight: 5 }}
                onClick={() => this.calcular("-")}
              >
                -
              </Button>
              <Button
                color="secondary"
                style={{ marginRight: 5 }}
                onClick={() => this.calcular("*")}
              >
                *
              </Button>
              <Button
                color="secondary"
                style={{ marginRight: 5 }}
                onClick={() => this.calcular("%2F")}
              >
                /
              </Button>
              <Button
                color="secondary"
                style={{ marginRight: 5 }}
                onClick={() => this.calcular("**")}
              >
                **
              </Button>
              <Button
                color="secondary"
                style={{ marginRight: 5 }}
                onClick={() => this.calcular("++")}
              >
                ++
              </Button>
            </FormGroup>
          </Col>
        </Row>
        {this.state.erro !== "" && (
          <Row className="justify-content-center mt-2">
            <Col className="col-sm-9 col-md-9 col-lg-6">
              <Alert color="danger">{this.state.erro}</Alert>
            </Col>
          </Row>
        )}
        {this.state.msgExcluir !== "" && (
          <Row className="justify-content-center mt-2">
            <Col className="col-sm-9 col-md-9 col-lg-6">
              <Alert color="success">{this.state.msgExcluir}</Alert>
            </Col>
          </Row>
        )}
        <Row className="justify-content-center mt-2">
          <Col className="col-sm-9 col-md-9 col-lg-6 border" style={{ height: 200, overflowY: "auto" }}>
            {lista}
          </Col>
        </Row>
      </Container>
    );
  }
}