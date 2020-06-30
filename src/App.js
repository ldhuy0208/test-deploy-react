import React, { Component, PureComponent } from "react";
import Cell from "./component/Cell";
import "./App.scss";

const HANG = 4;
const COT = 3;
const SO_LUONG_BOOM = 2;

export class App extends  PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      time: 0,
      isStarted: false,
      isWin: false,
    };
  }

  khoiTaoBoom = () => {
    const listBoom = [];
    while (listBoom.length < SO_LUONG_BOOM) {
      const hang = Math.round(Math.random() * (HANG - 1));
      const cot = Math.round(Math.random() * (COT - 1));

      const isExists =
        listBoom.filter((ele) => ele.hang === hang && ele.cot === cot).length >
        0;
      if (!isExists) listBoom.push({ hang, cot });
    }
    console.log(listBoom);
    return listBoom;
  };

  khoiTaoDanhSach = () => {
    const listBoom = this.khoiTaoBoom();

    const listAllCell = [];
    for (let i = 0; i < HANG; i++) {
      listAllCell[i] = [];
      for (let j = 0; j < COT; j++) {
        listAllCell[i][j] = {
          isBoom:
            listBoom.filter((ele) => ele.hang === i && ele.cot === j).length >
            0,
          isOpen: false,
          isFlag: false,
          totalBoom: null,
        };
      }
    }

    this.setState({ list: listAllCell });
  };

  demSoLuongBoomTamOXungQuanh = (viTri) => {
    const { hang, cot } = viTri;
    let count = 0;

    for (let i = hang - 1; i <= hang + 1; i++) {
      if (!(i >= 0 && i < HANG)) continue;
      for (let j = cot - 1; j <= cot + 1 && j < COT && j >= 0; j++) {
        if (!(j >= 0 && j < COT)) continue;
        if (this.state.list[i][j].isBoom) count++;
      }
    }
    return count;
  };

  openACell = (updateList, viTri) => {
    const { hang, cot } = viTri;
    if (updateList[hang][cot].isOpen) return false;

    if (updateList[hang][cot].isMine) return true;

    updateList[hang][cot].isOpen = true;
    const soLuongBoom = this.demSoLuongBoomTamOXungQuanh(viTri);

    if (soLuongBoom > 0) {
      updateList[hang][cot].totalBoom = soLuongBoom;
    } else {
      let r1 = hang === 0 ? 0 : -1;
      let c1 = cot === 0 ? 0 : -1;
      let r2 = hang === HANG - 1 ? 1 : 2;
      let c2 = cot === COT - 1 ? 1 : 2;

      for (; r1 < r2; r1++)
        for (let j = c1; j < c2; j++) {
          this.openACell(updateList, { hang: hang + r1, cot: cot + j });
        }
    }
    return false;
  };

  moMotO = (viTri, e) => {
    e.preventDefault();

    if (e.type === "click") {
      const { hang, cot } = viTri;
      if (this.state.list[hang][cot].isBoom) {
        alert("Bùm");
        this.setState({ list: [] }, () => {
          this.khoiTaoDanhSach();
        });
        return;
      }
      const updateList = this.state.list;
      this.openACell(updateList, viTri);

      this.setState(
        {
          list: updateList,
          isStarted: true,
        },
        () => {
          if (this.isWinGame()) {
            this.khoiTaoDanhSach();
          }
        }
      );
    } else if (e.type === "contextmenu") {
      console.log("Right click");

      const { hang, cot } = viTri;
      const updateList = [...this.state.list];
      updateList[hang][cot].isFlag = !this.state.list[hang][cot].isFlag;

      this.setState({
        list: updateList,
      });
    }
  };

  isWinGame = () => {
    for (let i = 0; i < HANG; i++)
      for (let j = 0; j < COT; j++) {
        if (
          this.state.list[i][j].isOpen === false &&
          this.state.list[i][j].isBoom === false
        )
          return this.setState({ isWin: false });
      }
    this.setState({ isWin: true });
  };
  onFlag = (viTri) => {
    const { hang, cot } = viTri;
    const updateList = [...this.state.list];
    updateList[hang][cot].isFlag = !this.state.list[hang][cot];

    this.setState({
      list: updateList,
    });
  };
  startNewGame = () => {
    this.khoiTaoDanhSach();
    this.setState({
      isWin: false,
      time: 0,
    });
  };
  componentDidMount() {
    this.khoiTaoDanhSach();
  }
  render() {
    return (
      <div className="app">
        <header>
          <div>Bom còn lại</div>
          <div>
            <button onClick={this.startNewGame}>
              {this.state.isWin ? (
                <img
                  src="https://img.icons8.com/emoji/48/000000/smiling-face-with-sunglasses.png"
                  alt="new game"
                />
              ) : (
                <img
                  src="https://img.icons8.com/emoji/48/000000/smirking-face.png"
                  alt="new game"
                />
              )}
            </button>
          </div>
          <div>Thời gian: {this.state.time}</div>
        </header>
        <main>
          {this.state.list.map((hang, i) => (
            <div key={Math.random() + new Date().getTime} className="row">
              {hang.map((cot, j) => (
                <Cell
                  key={Math.random() + new Date().getTime}
                  onOpen={(e) => this.moMotO({ hang: i, cot: j }, e)}
                  isBoom={this.state.list[i][j].isBoom}
                  isOpen={this.state.list[i][j].isOpen}
                  totalBoom={this.state.list[i][j].totalBoom}
                  isFlag={this.state.list[i][j].isFlag}
                />
              ))}
            </div>
          ))}
        </main>
      </div>
    );
  }
}

export default App;
