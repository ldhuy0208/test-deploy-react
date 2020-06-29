import React, { Component } from "react";
import Cell from "./component/Cell";
import "./App.scss";
const HANG = 10;
const COT = 20;
const SO_LUONG_BOOM = 20;

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
    };
  }

  khoiTaoBoom = () => {
    const listBoom = [];
    while (listBoom.length < SO_LUONG_BOOM) {
      const hang = Math.round(Math.random() * HANG);
      const cot = Math.round(Math.random() * COT);

      const isExists =
        listBoom.filter((ele) => ele.hang === hang && ele.cot === cot).length >
        0;
      if (!isExists) listBoom.push({ hang, cot });
    }

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

  openACell = (
    updateList,
    viTriBanDau,
    viTriTiepTheo = viTriBanDau,
    daKiemTra = []
  ) => {
    console.log("chẹck open-------------------------------------------------");
    console.log(daKiemTra);
    console.log(viTriTiepTheo);

    const { hang, cot } = viTriTiepTheo;

    if (
      daKiemTra.filter((ele) => ele.hang === hang && ele.cot === cot).length > 0
    ) {
      return;
    }

    daKiemTra.push(viTriTiepTheo);

    if (!(hang >= 0 && hang < HANG && cot >= 0 && cot < COT)) return;

    const soLuongBoom = this.demSoLuongBoomTamOXungQuanh(viTriTiepTheo);

    if (
      hang === viTriBanDau.hang &&
      cot === viTriBanDau.cot &&
      soLuongBoom !== 0
    ) {
      updateList[hang][cot].isOpen = true;
      updateList[hang][cot].totalBoom = soLuongBoom;
    }
    if (
      hang !== viTriBanDau.hang &&
      cot !== viTriBanDau.cot &&
      soLuongBoom !== 0
    ) {
      updateList[hang][cot].isOpen = true;
      updateList[hang][cot].totalBoom = soLuongBoom;
    }
    if (soLuongBoom === 0) {
      updateList[hang][cot].isOpen = true;
      updateList[hang][cot].totalBoom = soLuongBoom;
      this.openACell(
        updateList,
        viTriBanDau,
        {
          hang: hang,
          cot: cot - 1,
        },
        daKiemTra
      );
      this.openACell(
        updateList,
        viTriBanDau,
        {
          hang: hang + 1,
          cot: cot,
        },
        daKiemTra
      );
      this.openACell(
        updateList,
        viTriBanDau,
        {
          hang: hang,
          cot: cot + 1,
        },
        daKiemTra
      );
      this.openACell(
        updateList,
        viTriBanDau,
        {
          hang: hang - 1,
          cot: cot,
        },
        daKiemTra
			);
			this.openACell(
        updateList,
        viTriBanDau,
        {
          hang: hang - 1,
          cot: cot - 1,
        },
        daKiemTra
			);
			this.openACell(
        updateList,
        viTriBanDau,
        {
          hang: hang -1,
          cot: cot + 1,
        },
        daKiemTra
			);
			this.openACell(
        updateList,
        viTriBanDau,
        {
          hang: hang + 1,
          cot: cot -1,
        },
        daKiemTra
			);
			this.openACell(
        updateList,
        viTriBanDau,
        {
          hang: hang + 1,
          cot: cot + 1,
        },
        daKiemTra
      );
    }
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

      this.setState({
        list: updateList,
      });
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

  onFlag = (viTri) => {
    const { hang, cot } = viTri;
    const updateList = [...this.state.list];
    updateList[hang][cot].isFlag = !this.state.list[hang][cot];

    this.setState({
      list: updateList,
    });
  };
  componentDidMount() {
    this.khoiTaoDanhSach();
  }
  render() {
    return (
      <div className="app">
        {this.state.list.map((hang, i) => (
          <div className="row">
            {hang.map((cot, j) => (
              <Cell
                onOpen={(e) => this.moMotO({ hang: i, cot: j }, e)}
                isBoom={this.state.list[i][j].isBoom}
                totalBoom={this.state.list[i][j].totalBoom}
                isFlag={this.state.list[i][j].isFlag}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default App;
