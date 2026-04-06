declare module "@egjs/react-view360" {
  import { Component } from "react";

  export interface View360Props {
    className?: string;
    projection: any;
    [key: string]: any;
  }

  export class EquirectProjection {
    constructor(config: { src: string });
  }

  export default class View360 extends Component<View360Props> {}
}
