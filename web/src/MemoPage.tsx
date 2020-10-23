import React, { useRef, useState, useCallback, useEffect } from "react";
import GenericTemplate from "./GenericTemplate";
import MaterialTable from "material-table";
import SignatureCanvas from "react-signature-canvas";
import ReactSignatureCanvas from "react-signature-canvas";
import pointGroupArray from "react-signature-canvas";
import Axios from "axios";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const API_ENDPOINT_MEMOS = process.env.REACT_APP_API_ENDPOINT_MEMOS!;

export interface Memo {
  imageId: string;
  createdAt: string;
  imageData: string;
  status: string;
  doneAt: string;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  button: {
    marginLeft: theme.spacing(10),
    height: 60,
  },
}));

const MemoPage: React.FC = () => {
  const classes = useStyles();
  const canvasRef = useRef<ReactSignatureCanvas | null>();
  const [image, setImage] = useState<string>();

  const useGetMemoList = () => {
    const [isCompleted, setIsCompleted] = useState(false);
    const [data, setData] = useState<Memo[]>([]);

    const getData = useCallback(async () => {
      setIsCompleted(false);
      const response = await Axios.get(API_ENDPOINT_MEMOS + "items");
      setData(response.data);
      setIsCompleted(true);
    }, []);
    return { getData, data, isCompleted };
  };

  const getMemoList = useGetMemoList();

  const createTableData = () => {
    const data = getMemoList.data.map((d) =>
      Object.assign({}, d, {
        imageData: <img src={`${d.imageData}`} alt="text" />,
      })
    );
    return data;
  };

  const createMemo = async () => {
    await Axios.post(
      API_ENDPOINT_MEMOS + "item",
      { imageData: image },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const updateMemo = async (data: Memo) => {
    await Axios.put(API_ENDPOINT_MEMOS + "item/" + (data as any).memoId, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    if (!getMemoList.isCompleted) {
      getMemoList.getData();
    }
  }, [getMemoList]);

  return (
    <GenericTemplate title="">
      <Paper className={classes.paper}>
        <SignatureCanvas
          ref={(ref) => {
            canvasRef.current = ref;
          }}
          minWidth={2}
          maxWidth={2}
          penColor="white"
          backgroundColor="black"
          canvasProps={{
            width: 400,
            height: 80,
            className: "sigCanvas",
          }}
          onEnd={() => {
            setImage((canvasRef.current as pointGroupArray).toDataURL());
          }}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={image === undefined}
          onClick={() => {
            createMemo();
            setImage(undefined);
            (canvasRef.current as pointGroupArray).clear();
            getMemoList.getData();
          }}
        >
          登録
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={image === undefined}
          onClick={() => {
            setImage(undefined);
            (canvasRef.current as pointGroupArray).clear();
          }}
        >
          クリア
        </Button>
      </Paper>
      <MaterialTable
        columns={[
          { title: "メモ画像", field: "imageData" },
          { title: "登録日", field: "createdAt", defaultSort: "desc" },
          { title: "ステータス", field: "status" },
          { title: "完了日", field: "doneAt" },
        ]}
        data={createTableData()}
        options={{
          search: false,
          toolbar: false,
        }}
        localization={{
          header: { actions: "" },
        }}
        actions={[
          {
            icon: () => (
              <Button variant="contained" color="primary">
                完了
              </Button>
            ),
            onClick: (_, data) => {
              updateMemo(data as any);
              getMemoList.getData();
            },
          },
        ]}
      />
    </GenericTemplate>
  );
};

export default MemoPage;
