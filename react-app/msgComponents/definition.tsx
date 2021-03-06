import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";
import {IMsgProps, ISelItemsState} from "../src/parameters";
import {SignalForm, MessageForm} from "../../src/candb_provider";

export class MessageDefinition extends React.Component <IMsgProps, ISelItemsState> {
  message = this.props.msg;
  listOfSignal = this.props.listOfSignal;

  constructor(props : IMsgProps) {
    super(props);
  }

  handleFormChange (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
    const msgKey = e.target.id.split("_")[1];
    this.message[msgKey]= e.target.value;
  };

  render() {
    return (
      <Form >
        <Form.Row>
          <Form.Group as={Col} md="3" controlId="_name">
            <Form.Label>Name:</Form.Label>
            <Form.Control required
                          type="text"
                          defaultValue={this.message.name}
                          onChange={(event) => this.handleFormChange(event as any)}>
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="3" controlId="_msgType">
            <Form.Label>Type:</Form.Label>
            <Form.Control as="select"
                          defaultValue={this.message.msgType}
                          onChange={(event) => this.handleFormChange(event as any)}>
                <option>CAN Standard</option>
                <option>CAN Extended</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="3" controlId="_id">
            <Form.Label>ID:</Form.Label>
            <Form.Control defaultValue={this.message.id} 
                          onChange={(event) => this.handleFormChange(event as any)}>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="_dlc">
            <Form.Label>DLC:</Form.Label>
            <Form.Control type='number'
                          min='1' max='8' step='1'
                          defaultValue={this.message.dlc}
                          onChange={(event) => this.handleFormChange(event as any)}>
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="3" controlId="_transmitter">
            <Form.Label>Transmitter:</Form.Label>
            <Form.Control as="select"
                          onChange={(event) => this.handleFormChange(event as any)} disabled>
                    {(() => {
                      if (this.message.transmitters.length > 1){
                        return  <option>-- Mutiple Transmitters --</option>;
                      } 
                      else if (this.message.transmitters.length === 1) {
                        return  <option>{this.message.transmitters[0].name}</option>;
                      } 
                      else {
                        return  <option>-- No Transmitter --</option>;
                      }
                    })() }
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="_txmethod">
            <Form.Label>Tx Method:</Form.Label>
            <Form.Control as="select"
                          onChange={(event) => this.handleFormChange(event as any)} disabled>
                    <option>NoMsgSendType</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="6" controlId="_cycletime">
            <Form.Label>Cycle Time:</Form.Label>
            <Form.Control defaultValue={this.message.cycletime}
                          onChange={(event) => this.handleFormChange(event as any)} disabled>
            </Form.Control>
          </Form.Group>
        </Form.Row>
      </Form>
  );
  }
}