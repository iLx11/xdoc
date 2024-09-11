# 工程文件

## 获取文件

**用 STMCubeMX 分别生成 CustomHID 和 CDC 的工程**

:::tip

虽然这篇文章只是验证了这两种设备的组合，理论上可以通过这种方式配置其他多个设备的组合

:::

**单独获取不同工程中** `Middlewares/ST/STM32_USB_Device_Library/Class` 目录下的，`CDC` 或  `CustomHID`  目录

**再单独获取不同工程中** `USB_DEVICE/App` 目录下的 `usbd_custom_hid_if.c/h` 或 `usb_cdc_if.c/h`

可以在任何一个工程基础上添加文件或者重新创建一个工程，这里以 `customhid`  工程为基础

## 文件树形结构图

可以仿照这个结构图来配置刚才单独获取到的文件

::: details 点击展开树形结构图

```bash
├─Middlewares
│  └─ST
│      └─STM32_USB_Device_Library
│          ├─Class
│          │  ├─CDC
│          │  │  ├─Inc
│          │  │  │      usbd_cdc.h
│          │  │  │
│          │  │  └─Src
│          │  │          usbd_cdc.c
│          │  │
│          │  ├─Composite
│          │  │  ├─Inc
│          │  │  │      usbd_composite.h
│          │  │  │
│          │  │  └─Src
│          │  │          usbd_composite.c
│          │  │
│          │  └─CustomHID
│          │      ├─Inc
│          │      │      usbd_customhid.h
│          │      │
│          │      └─Src
│          │              usbd_customhid.c
│          │
│          └─Core
│              ├─Inc
│              │      usbd_core.h
│              │      usbd_ctlreq.h
│              │      usbd_def.h
│              │      usbd_ioreq.h
│              │
│              └─Src
│                      usbd_core.c
│                      usbd_ctlreq.c
│                      usbd_ioreq.c
│
├─USB_DEVICE
│  ├─App
│  │      usbd_cdc_if.c
│  │      usbd_cdc_if.h
│  │      usbd_custom_hid_if.c
│  │      usbd_custom_hid_if.h
│  │      usbd_desc.c
│  │      usbd_desc.h
│  │      usb_device.c
│  │      usb_device.h
│  │
│  └─Target
│          usbd_conf.c
│          usbd_conf.h
```

:::

## 开始修改与配置文件

### USB 设备初始化函数

**在 `USB_DEVICE/App/usb_device.h` 找到 `MX_USB_DEVICE_Init`  函数进行修改**

注释掉标识中的代码，也就是具体设备的注册函数，因为之后要统一注册多个设备

```c
void MX_USB_DEVICE_Init(void)
{
  /* USER CODE BEGIN USB_DEVICE_Init_PreTreatment */

  /* USER CODE END USB_DEVICE_Init_PreTreatment */

  /* Init Device Library, add supported class and start the library. */
  if (USBD_Init(&hUsbDeviceFS, &FS_Desc, DEVICE_FS) != USBD_OK)
  {
    Error_Handler();
  }
  if (USBD_RegisterClass(&hUsbDeviceFS, &USBD_COMPOSITE_ClassDriver) != USBD_OK)
  {
    Error_Handler();
  }
  // if (USBD_CUSTOM_HID_RegisterInterface(&hUsbDeviceFS, &USBD_CustomHID_fops_FS) != USBD_OK) // [!code --]
  // {	// [!code --]
  //   Error_Handler();	// [!code --]
  // }	// [!code --]
  if (USBD_Start(&hUsbDeviceFS) != USBD_OK)
  {
    Error_Handler();
  }

  /* USER CODE BEGIN USB_DEVICE_Init_PostTreatment */

  /* USER CODE END USB_DEVICE_Init_PostTreatment */
}
```

**在 `Middlewares/ST/STM32_USB_Device_Library/Class` 目录下，我会标识出需要修改的地方**

### 修改 `CDC/Src/usbd_cdc.c` 文件

默认 `pdev->pClassData` 指针是通过 `hUsbDeviceFS` 获取的，但是当前系统中有两个设备，对应的 `pdev->pClassData` 是分开的。接收函数是中断调用 `usbd_composite` 再调用到 `cdc` 或者 `customhid` 对应方法中，在 `usbd_composite` 会重新对 `pdev->pClassData` 进行赋值

::: details 点击展开代码，因为太长了影响阅读

```c
/**
  * @}
  */

/** @defgroup USBD_CDC_Private_Functions
  * @{
  */

/**
  * @brief  USBD_CDC_Init
  *         Initialize the CDC interface
  * @param  pdev: device instance
  * @param  cfgidx: Configuration index
  * @retval status
  */
static USBD_CDC_HandleTypeDef usbd_cdc_handle;	// [!code ++]
static uint8_t  USBD_CDC_Init(USBD_HandleTypeDef *pdev, uint8_t cfgidx)
{
  uint8_t ret = 0U;
  USBD_CDC_HandleTypeDef   *hcdc;

  if (pdev->dev_speed == USBD_SPEED_HIGH)
  {
    /* Open EP IN */
    USBD_LL_OpenEP(pdev, CDC_IN_EP, USBD_EP_TYPE_BULK,
                   CDC_DATA_HS_IN_PACKET_SIZE);

    pdev->ep_in[CDC_IN_EP & 0xFU].is_used = 1U;

    /* Open EP OUT */
    USBD_LL_OpenEP(pdev, CDC_OUT_EP, USBD_EP_TYPE_BULK,
                   CDC_DATA_HS_OUT_PACKET_SIZE);

    pdev->ep_out[CDC_OUT_EP & 0xFU].is_used = 1U;

  }
  else
  {
    /* Open EP IN */
    USBD_LL_OpenEP(pdev, CDC_IN_EP, USBD_EP_TYPE_BULK,
                   CDC_DATA_FS_IN_PACKET_SIZE);

    pdev->ep_in[CDC_IN_EP & 0xFU].is_used = 1U;

    /* Open EP OUT */
    USBD_LL_OpenEP(pdev, CDC_OUT_EP, USBD_EP_TYPE_BULK,
                   CDC_DATA_FS_OUT_PACKET_SIZE);

    pdev->ep_out[CDC_OUT_EP & 0xFU].is_used = 1U;
  }
  /* Open Command IN EP */
  USBD_LL_OpenEP(pdev, CDC_CMD_EP, USBD_EP_TYPE_INTR, CDC_CMD_PACKET_SIZE);
  pdev->ep_in[CDC_CMD_EP & 0xFU].is_used = 1U;
  memset(&usbd_cdc_handle,0,sizeof(USBD_CDC_HandleTypeDef));	// [!code ++]
  // pdev->pClassData = USBD_malloc(sizeof(USBD_CDC_HandleTypeDef));	// [!code --]
  pdev->pClassData=&usbd_cdc_handle;

  if (pdev->pClassData == NULL)
  {
    ret = 1U;
  }
  else
  {
    hcdc = (USBD_CDC_HandleTypeDef *) pdev->pClassData;

    /* Init  physical Interface components */
    ((USBD_CDC_ItfTypeDef *)pdev->pUserData)->Init();

    /* Init Xfer states */
    hcdc->TxState = 0U;
    hcdc->RxState = 0U;

    if (pdev->dev_speed == USBD_SPEED_HIGH)
    {
      /* Prepare Out endpoint to receive next packet */
      USBD_LL_PrepareReceive(pdev, CDC_OUT_EP, hcdc->RxBuffer,
                             CDC_DATA_HS_OUT_PACKET_SIZE);
    }
    else
    {
      /* Prepare Out endpoint to receive next packet */
      USBD_LL_PrepareReceive(pdev, CDC_OUT_EP, hcdc->RxBuffer,
                             CDC_DATA_FS_OUT_PACKET_SIZE);
    }
  }
  return ret;
}

/**
  * @brief  USBD_CDC_Init
  *         DeInitialize the CDC layer
  * @param  pdev: device instance
  * @param  cfgidx: Configuration index
  * @retval status
  */
static uint8_t  USBD_CDC_DeInit(USBD_HandleTypeDef *pdev, uint8_t cfgidx)
{
  uint8_t ret = 0U;

  /* Close EP IN */
  USBD_LL_CloseEP(pdev, CDC_IN_EP);
  pdev->ep_in[CDC_IN_EP & 0xFU].is_used = 0U;

  /* Close EP OUT */
  USBD_LL_CloseEP(pdev, CDC_OUT_EP);
  pdev->ep_out[CDC_OUT_EP & 0xFU].is_used = 0U;

  /* Close Command IN EP */
  USBD_LL_CloseEP(pdev, CDC_CMD_EP);
  pdev->ep_in[CDC_CMD_EP & 0xFU].is_used = 0U;

  /* DeInit  physical Interface components */
  if (pdev->pClassData != NULL)
  {
    ((USBD_CDC_ItfTypeDef *)pdev->pUserData)->DeInit();
    // USBD_free(pdev->pClassData);	// [!code --]
    pdev->pClassData = NULL;
  }

  return ret;
}

/**
  * @brief  USBD_CDC_Setup
  *         Handle the CDC specific requests
  * @param  pdev: instance
  * @param  req: usb requests
  * @retval status
  */
static uint8_t  USBD_CDC_Setup(USBD_HandleTypeDef *pdev,
                               USBD_SetupReqTypedef *req)
{
  // USBD_CDC_HandleTypeDef   *hcdc = (USBD_CDC_HandleTypeDef *) pdev->pClassData; // [!code --]
  USBD_CDC_HandleTypeDef   *hcdc = &usbd_cdc_handle;	// [!code ++]

  uint8_t ifalt = 0U;
  uint16_t status_info = 0U;
  uint8_t ret = USBD_OK;

  switch (req->bmRequest & USB_REQ_TYPE_MASK)
  {
    case USB_REQ_TYPE_CLASS :
      if (req->wLength)
      {
        if (req->bmRequest & 0x80U)
        {
          ((USBD_CDC_ItfTypeDef *)pdev->pUserData)->Control(req->bRequest,
                                                            (uint8_t *)(void *)hcdc->data,
                                                            req->wLength);

          USBD_CtlSendData(pdev, (uint8_t *)(void *)hcdc->data, req->wLength);
        }
        else
        {
          hcdc->CmdOpCode = req->bRequest;
          hcdc->CmdLength = (uint8_t)req->wLength;

          USBD_CtlPrepareRx(pdev, (uint8_t *)(void *)hcdc->data, req->wLength);
        }
      }
      else
      {
        ((USBD_CDC_ItfTypeDef *)pdev->pUserData)->Control(req->bRequest,
                                                          (uint8_t *)(void *)req, 0U);
      }
      break;

    case USB_REQ_TYPE_STANDARD:
      switch (req->bRequest)
      {
        case USB_REQ_GET_STATUS:
          if (pdev->dev_state == USBD_STATE_CONFIGURED)
          {
            USBD_CtlSendData(pdev, (uint8_t *)(void *)&status_info, 2U);
          }
          else
          {
            USBD_CtlError(pdev, req);
            ret = USBD_FAIL;
          }
          break;

        case USB_REQ_GET_INTERFACE:
          if (pdev->dev_state == USBD_STATE_CONFIGURED)
          {
            USBD_CtlSendData(pdev, &ifalt, 1U);
          }
          else
          {
            USBD_CtlError(pdev, req);
            ret = USBD_FAIL;
          }
          break;

        case USB_REQ_SET_INTERFACE:
          if (pdev->dev_state != USBD_STATE_CONFIGURED)
          {
            USBD_CtlError(pdev, req);
            ret = USBD_FAIL;
          }
          break;

        default:
          USBD_CtlError(pdev, req);
          ret = USBD_FAIL;
          break;
      }
      break;

    default:
      USBD_CtlError(pdev, req);
      ret = USBD_FAIL;
      break;
  }

  return ret;
}

/**
  * @brief  USBD_CDC_DataIn
  *         Data sent on non-control IN endpoint
  * @param  pdev: device instance
  * @param  epnum: endpoint number
  * @retval status
  */
static uint8_t  USBD_CDC_DataIn(USBD_HandleTypeDef *pdev, uint8_t epnum)
{
   USBD_CDC_HandleTypeDef *hcdc = (USBD_CDC_HandleTypeDef *)pdev->pClassData;
  PCD_HandleTypeDef *hpcd = pdev->pData;

  if (pdev->pClassData != NULL)
  {
    if ((pdev->ep_in[epnum].total_length > 0U) && ((pdev->ep_in[epnum].total_length % hpcd->IN_ep[epnum].maxpacket) == 0U))
    {
      /* Update the packet total length */
      pdev->ep_in[epnum].total_length = 0U;

      /* Send ZLP */
      USBD_LL_Transmit(pdev, epnum, NULL, 0U);
    }
    else
    {
      hcdc->TxState = 0U;
    }
    return USBD_OK;
  }
  else
  {
    return USBD_FAIL;
  }
}

/**
  * @brief  USBD_CDC_DataOut
  *         Data received on non-control Out endpoint
  * @param  pdev: device instance
  * @param  epnum: endpoint number
  * @retval status
  */
static uint8_t  USBD_CDC_DataOut(USBD_HandleTypeDef *pdev, uint8_t epnum)
{
  // USBD_CDC_HandleTypeDef   *hcdc = (USBD_CDC_HandleTypeDef *) pdev->pClassData;	// [!code --]
  USBD_CDC_HandleTypeDef   *hcdc = &usbd_cdc_handle;	// [!code ++]

  /* Get the received data length */
  hcdc->RxLength = USBD_LL_GetRxDataSize(pdev, epnum);

  /* USB data will be immediately processed, this allow next USB traffic being
  NAKed till the end of the application Xfer */
  if (pdev->pClassData != NULL)
  {
    ((USBD_CDC_ItfTypeDef *)pdev->pUserData)->Receive(hcdc->RxBuffer, &hcdc->RxLength);

    return USBD_OK;
  }
  else
  {
    return USBD_FAIL;
  }
}

/**
  * @brief  USBD_CDC_EP0_RxReady
  *         Handle EP0 Rx Ready event
  * @param  pdev: device instance
  * @retval status
  */
static uint8_t  USBD_CDC_EP0_RxReady(USBD_HandleTypeDef *pdev)
{
  // USBD_CDC_HandleTypeDef   *hcdc = (USBD_CDC_HandleTypeDef *) pdev->pClassData;	// [!code --]
  USBD_CDC_HandleTypeDef   *hcdc = &usbd_cdc_handle;	// [!code ++]

  if ((pdev->pUserData != NULL) && (hcdc->CmdOpCode != 0xFFU))
  {
    ((USBD_CDC_ItfTypeDef *)pdev->pUserData)->Control(hcdc->CmdOpCode,
                                                      (uint8_t *)(void *)hcdc->data,
                                                      (uint16_t)hcdc->CmdLength);
    hcdc->CmdOpCode = 0xFFU;

  }
  return USBD_OK;
}

/**
  * @brief  USBD_CDC_GetFSCfgDesc
  *         Return configuration descriptor
  * @param  speed : current device speed
  * @param  length : pointer data length
  * @retval pointer to descriptor buffer
  */
static uint8_t  *USBD_CDC_GetFSCfgDesc(uint16_t *length)
{
  *length = sizeof(USBD_CDC_CfgFSDesc);
  return USBD_CDC_CfgFSDesc;
}

/**
  * @brief  USBD_CDC_GetHSCfgDesc
  *         Return configuration descriptor
  * @param  speed : current device speed
  * @param  length : pointer data length
  * @retval pointer to descriptor buffer
  */
static uint8_t  *USBD_CDC_GetHSCfgDesc(uint16_t *length)
{
  *length = sizeof(USBD_CDC_CfgHSDesc);
  return USBD_CDC_CfgHSDesc;
}

/**
  * @brief  USBD_CDC_GetCfgDesc
  *         Return configuration descriptor
  * @param  speed : current device speed
  * @param  length : pointer data length
  * @retval pointer to descriptor buffer
  */
static uint8_t  *USBD_CDC_GetOtherSpeedCfgDesc(uint16_t *length)
{
  *length = sizeof(USBD_CDC_OtherSpeedCfgDesc);
  return USBD_CDC_OtherSpeedCfgDesc;
}

/**
* @brief  DeviceQualifierDescriptor
*         return Device Qualifier descriptor
* @param  length : pointer data length
* @retval pointer to descriptor buffer
*/
uint8_t  *USBD_CDC_GetDeviceQualifierDescriptor(uint16_t *length)
{
  *length = sizeof(USBD_CDC_DeviceQualifierDesc);
  return USBD_CDC_DeviceQualifierDesc;
}

/**
* @brief  USBD_CDC_RegisterInterface
  * @param  pdev: device instance
  * @param  fops: CD  Interface callback
  * @retval status
  */
uint8_t  USBD_CDC_RegisterInterface(USBD_HandleTypeDef   *pdev,
                                    USBD_CDC_ItfTypeDef *fops)
{
  uint8_t  ret = USBD_FAIL;

  if (fops != NULL)
  {
    pdev->pUserData = fops;
    ret = USBD_OK;
  }

  return ret;
}

/**
  * @brief  USBD_CDC_SetTxBuffer
  * @param  pdev: device instance
  * @param  pbuff: Tx Buffer
  * @retval status
  */
uint8_t  USBD_CDC_SetTxBuffer(USBD_HandleTypeDef   *pdev,
                              uint8_t  *pbuff,
                              uint16_t length)
{
  // USBD_CDC_HandleTypeDef   *hcdc = (USBD_CDC_HandleTypeDef *) pdev->pClassData;	// [!code --]
  USBD_CDC_HandleTypeDef   *hcdc = &usbd_cdc_handle;	// [!code ++]

  hcdc->TxBuffer = pbuff;
  hcdc->TxLength = length;

  return USBD_OK;
}


/**
  * @brief  USBD_CDC_SetRxBuffer
  * @param  pdev: device instance
  * @param  pbuff: Rx Buffer
  * @retval status
  */
uint8_t  USBD_CDC_SetRxBuffer(USBD_HandleTypeDef   *pdev,
                              uint8_t  *pbuff)
{
  // USBD_CDC_HandleTypeDef   *hcdc = (USBD_CDC_HandleTypeDef *) pdev->pClassData;	// [!code --]
  USBD_CDC_HandleTypeDef   *hcdc = &usbd_cdc_handle;	// [!code ++]

  hcdc->RxBuffer = pbuff;

  return USBD_OK;
}

/**
  * @brief  USBD_CDC_TransmitPacket
  *         Transmit packet on IN endpoint
  * @param  pdev: device instance
  * @retval status
  */
uint8_t  USBD_CDC_TransmitPacket(USBD_HandleTypeDef *pdev)
{
  // USBD_CDC_HandleTypeDef   *hcdc = (USBD_CDC_HandleTypeDef *) pdev->pClassData;	// [!code --]
  USBD_CDC_HandleTypeDef   *hcdc = &usbd_cdc_handle;	// [!code ++]

  if (pdev->pClassData != NULL)
  {
    if (hcdc->TxState == 0U)
    {
      /* Tx Transfer in progress */
      hcdc->TxState = 1U;

      /* Update the packet total length */
      pdev->ep_in[CDC_IN_EP & 0xFU].total_length = hcdc->TxLength;

      /* Transmit next packet */
      USBD_LL_Transmit(pdev, CDC_IN_EP, hcdc->TxBuffer,
                       (uint16_t)hcdc->TxLength);

      return USBD_OK;
    }
    else
    {
      return USBD_BUSY;
    }
  }
  else
  {
    return USBD_FAIL;
  }
}


/**
  * @brief  USBD_CDC_ReceivePacket
  *         prepare OUT Endpoint for reception
  * @param  pdev: device instance
  * @retval status
  */
uint8_t  USBD_CDC_ReceivePacket(USBD_HandleTypeDef *pdev)
{
  // USBD_CDC_HandleTypeDef   *hcdc = (USBD_CDC_HandleTypeDef *) pdev->pClassData;	// [!code --]
  USBD_CDC_HandleTypeDef   *hcdc = &usbd_cdc_handle;	// [!code ++]

  /* Suspend or Resume USB Out process */
  if (pdev->pClassData != NULL)
  {
    if (pdev->dev_speed == USBD_SPEED_HIGH)
    {
      /* Prepare Out endpoint to receive next packet */
      USBD_LL_PrepareReceive(pdev,
                             CDC_OUT_EP,
                             hcdc->RxBuffer,
                             CDC_DATA_HS_OUT_PACKET_SIZE);
    }
    else
    {
      /* Prepare Out endpoint to receive next packet */
      USBD_LL_PrepareReceive(pdev,
                             CDC_OUT_EP,
                             hcdc->RxBuffer,
                             CDC_DATA_FS_OUT_PACKET_SIZE);
    }
    return USBD_OK;
  }
  else
  {
    return USBD_FAIL;
  }
}
/**
  * @}
  */

/**
  * @}
  */

/**
  * @}
  */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/

```

:::

### 修改 `CustomHID/Src/usbd_customhid.c` 文件

 ::: details 点击展开代码

```c

/**
  * @}
  */

/** @defgroup USBD_CUSTOM_HID_Private_Functions
  * @{
  */

/**
  * @brief  USBD_CUSTOM_HID_Init
  *         Initialize the CUSTOM_HID interface
  * @param  pdev: device instance
  * @param  cfgidx: Configuration index
  * @retval status
  */
static USBD_CUSTOM_HID_HandleTypeDef usbd_custom_hid_handle;	// [!code ++]
static uint8_t  USBD_CUSTOM_HID_Init(USBD_HandleTypeDef *pdev,
                                     uint8_t cfgidx)
{
  uint8_t ret = 0U;
  USBD_CUSTOM_HID_HandleTypeDef     *hhid;

  /* Open EP IN */
  USBD_LL_OpenEP(pdev, CUSTOM_HID_EPIN_ADDR, USBD_EP_TYPE_INTR,
                 CUSTOM_HID_EPIN_SIZE);

  pdev->ep_in[CUSTOM_HID_EPIN_ADDR & 0xFU].is_used = 1U;

  /* Open EP OUT */
  USBD_LL_OpenEP(pdev, CUSTOM_HID_EPOUT_ADDR, USBD_EP_TYPE_INTR,
                 CUSTOM_HID_EPOUT_SIZE);

  pdev->ep_out[CUSTOM_HID_EPOUT_ADDR & 0xFU].is_used = 1U;

  // pdev->pClassData = USBD_malloc(sizeof(USBD_CUSTOM_HID_HandleTypeDef));	// [!code --]
  memset(&usbd_custom_hid_handle,0,sizeof(USBD_CUSTOM_HID_HandleTypeDef));	// [!code ++]
  pdev->pClassData = &usbd_custom_hid_handle;
  
  if (pdev->pClassData == NULL)
  {
    ret = 1U;
  }
  else
  {
    hhid = (USBD_CUSTOM_HID_HandleTypeDef *) pdev->pClassData;

    hhid->state = CUSTOM_HID_IDLE;
    ((USBD_CUSTOM_HID_ItfTypeDef *)pdev->pUserData)->Init();

    /* Prepare Out endpoint to receive 1st packet */
    USBD_LL_PrepareReceive(pdev, CUSTOM_HID_EPOUT_ADDR, hhid->Report_buf,
                           USBD_CUSTOMHID_OUTREPORT_BUF_SIZE);
  }

  return ret;
}

/**
  * @brief  USBD_CUSTOM_HID_Init
  *         DeInitialize the CUSTOM_HID layer
  * @param  pdev: device instance
  * @param  cfgidx: Configuration index
  * @retval status
  */
static uint8_t  USBD_CUSTOM_HID_DeInit(USBD_HandleTypeDef *pdev,
                                       uint8_t cfgidx)
{
  /* Close CUSTOM_HID EP IN */
  USBD_LL_CloseEP(pdev, CUSTOM_HID_EPIN_ADDR);
  pdev->ep_in[CUSTOM_HID_EPIN_ADDR & 0xFU].is_used = 0U;

  /* Close CUSTOM_HID EP OUT */
  USBD_LL_CloseEP(pdev, CUSTOM_HID_EPOUT_ADDR);
  pdev->ep_out[CUSTOM_HID_EPOUT_ADDR & 0xFU].is_used = 0U;

  /* FRee allocated memory */
  if (pdev->pClassData != NULL)
  {
    ((USBD_CUSTOM_HID_ItfTypeDef *)pdev->pUserData)->DeInit();
    // USBD_free(pdev->pClassData);	// [!code --]
    pdev->pClassData = NULL;
  }
  return USBD_OK;
}

/**
  * @brief  USBD_CUSTOM_HID_Setup
  *         Handle the CUSTOM_HID specific requests
  * @param  pdev: instance
  * @param  req: usb requests
  * @retval status
  */
static uint8_t  USBD_CUSTOM_HID_Setup(USBD_HandleTypeDef *pdev,
                                      USBD_SetupReqTypedef *req)
{
  // USBD_CUSTOM_HID_HandleTypeDef *hhid = (USBD_CUSTOM_HID_HandleTypeDef *)pdev->pClassData;	// [!code --]
  USBD_CUSTOM_HID_HandleTypeDef *hhid = &usbd_custom_hid_handle;	// [!code ++]
   
  uint16_t len = 0U;
  uint8_t  *pbuf = NULL;
  uint16_t status_info = 0U;
  uint8_t ret = USBD_OK;

  switch (req->bmRequest & USB_REQ_TYPE_MASK)
  {
    case USB_REQ_TYPE_CLASS :
      switch (req->bRequest)
      {
        case CUSTOM_HID_REQ_SET_PROTOCOL:
          hhid->Protocol = (uint8_t)(req->wValue);
          break;

        case CUSTOM_HID_REQ_GET_PROTOCOL:
          USBD_CtlSendData(pdev, (uint8_t *)(void *)&hhid->Protocol, 1U);
          break;

        case CUSTOM_HID_REQ_SET_IDLE:
          hhid->IdleState = (uint8_t)(req->wValue >> 8);
          break;

        case CUSTOM_HID_REQ_GET_IDLE:
          USBD_CtlSendData(pdev, (uint8_t *)(void *)&hhid->IdleState, 1U);
          break;

        case CUSTOM_HID_REQ_SET_REPORT:
          hhid->IsReportAvailable = 1U;
          USBD_CtlPrepareRx(pdev, hhid->Report_buf, req->wLength);
          break;

        default:
          USBD_CtlError(pdev, req);
          ret = USBD_FAIL;
          break;
      }
      break;

    case USB_REQ_TYPE_STANDARD:
      switch (req->bRequest)
      {
        case USB_REQ_GET_STATUS:
          if (pdev->dev_state == USBD_STATE_CONFIGURED)
          {
            USBD_CtlSendData(pdev, (uint8_t *)(void *)&status_info, 2U);
          }
          else
          {
            USBD_CtlError(pdev, req);
            ret = USBD_FAIL;
          }
          break;

        case USB_REQ_GET_DESCRIPTOR:
          if (req->wValue >> 8 == CUSTOM_HID_REPORT_DESC)
          {
            len = MIN(USBD_CUSTOM_HID_REPORT_DESC_SIZE, req->wLength);
            pbuf = ((USBD_CUSTOM_HID_ItfTypeDef *)pdev->pUserData)->pReport;
          }
          else
          {
            if (req->wValue >> 8 == CUSTOM_HID_DESCRIPTOR_TYPE)
            {
              pbuf = USBD_CUSTOM_HID_Desc;
              len = MIN(USB_CUSTOM_HID_DESC_SIZ, req->wLength);
            }
          }

          USBD_CtlSendData(pdev, pbuf, len);
          break;

        case USB_REQ_GET_INTERFACE :
          if (pdev->dev_state == USBD_STATE_CONFIGURED)
          {
            USBD_CtlSendData(pdev, (uint8_t *)(void *)&hhid->AltSetting, 1U);
          }
          else
          {
            USBD_CtlError(pdev, req);
            ret = USBD_FAIL;
          }
          break;

        case USB_REQ_SET_INTERFACE :
          if (pdev->dev_state == USBD_STATE_CONFIGURED)
          {
            hhid->AltSetting = (uint8_t)(req->wValue);
          }
          else
          {
            USBD_CtlError(pdev, req);
            ret = USBD_FAIL;
          }
          break;

        default:
          USBD_CtlError(pdev, req);
          ret = USBD_FAIL;
          break;
      }
      break;

    default:
      USBD_CtlError(pdev, req);
      ret = USBD_FAIL;
      break;
  }
  return ret;
}

/**
  * @brief  USBD_CUSTOM_HID_SendReport
  *         Send CUSTOM_HID Report
  * @param  pdev: device instance
  * @param  buff: pointer to report
  * @retval status
  */
uint8_t USBD_CUSTOM_HID_SendReport(USBD_HandleTypeDef  *pdev,
                                   uint8_t *report,
                                   uint16_t len)
{
  // USBD_CUSTOM_HID_HandleTypeDef     *hhid = (USBD_CUSTOM_HID_HandleTypeDef *)pdev->pClassData;	// [!code --]
  USBD_CUSTOM_HID_HandleTypeDef *hhid = &usbd_custom_hid_handle;	// [!code ++]

  if (pdev->dev_state == USBD_STATE_CONFIGURED)
  {
    if (hhid->state == CUSTOM_HID_IDLE)
    {
      hhid->state = CUSTOM_HID_BUSY;
      USBD_LL_Transmit(pdev, CUSTOM_HID_EPIN_ADDR, report, len);
    }
    else
    {
      return USBD_BUSY;
    }
  }
  return USBD_OK;
}

/**
  * @brief  USBD_CUSTOM_HID_GetFSCfgDesc
  *         return FS configuration descriptor
  * @param  speed : current device speed
  * @param  length : pointer data length
  * @retval pointer to descriptor buffer
  */
static uint8_t  *USBD_CUSTOM_HID_GetFSCfgDesc(uint16_t *length)
{
  *length = sizeof(USBD_CUSTOM_HID_CfgFSDesc);
  return USBD_CUSTOM_HID_CfgFSDesc;
}

/**
  * @brief  USBD_CUSTOM_HID_GetHSCfgDesc
  *         return HS configuration descriptor
  * @param  speed : current device speed
  * @param  length : pointer data length
  * @retval pointer to descriptor buffer
  */
static uint8_t  *USBD_CUSTOM_HID_GetHSCfgDesc(uint16_t *length)
{
  *length = sizeof(USBD_CUSTOM_HID_CfgHSDesc);
  return USBD_CUSTOM_HID_CfgHSDesc;
}

/**
  * @brief  USBD_CUSTOM_HID_GetOtherSpeedCfgDesc
  *         return other speed configuration descriptor
  * @param  speed : current device speed
  * @param  length : pointer data length
  * @retval pointer to descriptor buffer
  */
static uint8_t  *USBD_CUSTOM_HID_GetOtherSpeedCfgDesc(uint16_t *length)
{
  *length = sizeof(USBD_CUSTOM_HID_OtherSpeedCfgDesc);
  return USBD_CUSTOM_HID_OtherSpeedCfgDesc;
}

/**
  * @brief  USBD_CUSTOM_HID_DataIn
  *         handle data IN Stage
  * @param  pdev: device instance
  * @param  epnum: endpoint index
  * @retval status
  */
static uint8_t  USBD_CUSTOM_HID_DataIn(USBD_HandleTypeDef *pdev,
                                       uint8_t epnum)
{
  /* Ensure that the FIFO is empty before a new transfer, this condition could
  be caused by  a new transfer before the end of the previous transfer */
  ((USBD_CUSTOM_HID_HandleTypeDef *)pdev->pClassData)->state = CUSTOM_HID_IDLE;

  return USBD_OK;
}

/**
  * @brief  USBD_CUSTOM_HID_DataOut
  *         handle data OUT Stage
  * @param  pdev: device instance
  * @param  epnum: endpoint index
  * @retval status
  */
static uint8_t  USBD_CUSTOM_HID_DataOut(USBD_HandleTypeDef *pdev,
                                        uint8_t epnum)
{

  // USBD_CUSTOM_HID_HandleTypeDef     *hhid = (USBD_CUSTOM_HID_HandleTypeDef *)pdev->pClassData;	// [!code --]
  USBD_CUSTOM_HID_HandleTypeDef *hhid = &usbd_custom_hid_handle;	// [!code ++]

  ((USBD_CUSTOM_HID_ItfTypeDef *)pdev->pUserData)->OutEvent(hhid->Report_buf[0],
                                                            hhid->Report_buf[1]);

  USBD_LL_PrepareReceive(pdev, CUSTOM_HID_EPOUT_ADDR, hhid->Report_buf,
                         USBD_CUSTOMHID_OUTREPORT_BUF_SIZE);

  return USBD_OK;
}

/**
  * @brief  USBD_CUSTOM_HID_EP0_RxReady
  *         Handles control request data.
  * @param  pdev: device instance
  * @retval status
  */
static uint8_t USBD_CUSTOM_HID_EP0_RxReady(USBD_HandleTypeDef *pdev)
{
  // USBD_CUSTOM_HID_HandleTypeDef     *hhid = (USBD_CUSTOM_HID_HandleTypeDef *)pdev->pClassData;	// [!code --]
  USBD_CUSTOM_HID_HandleTypeDef *hhid = &usbd_custom_hid_handle;	// [!code ++]

  if (hhid->IsReportAvailable == 1U)
  {
    ((USBD_CUSTOM_HID_ItfTypeDef *)pdev->pUserData)->OutEvent(hhid->Report_buf[0],
                                                              hhid->Report_buf[1]);
    hhid->IsReportAvailable = 0U;
  }

  return USBD_OK;
}

/**
* @brief  DeviceQualifierDescriptor
*         return Device Qualifier descriptor
* @param  length : pointer data length
* @retval pointer to descriptor buffer
*/
static uint8_t  *USBD_CUSTOM_HID_GetDeviceQualifierDesc(uint16_t *length)
{
  *length = sizeof(USBD_CUSTOM_HID_DeviceQualifierDesc);
  return USBD_CUSTOM_HID_DeviceQualifierDesc;
}

/**
* @brief  USBD_CUSTOM_HID_RegisterInterface
  * @param  pdev: device instance
  * @param  fops: CUSTOMHID Interface callback
  * @retval status
  */
uint8_t  USBD_CUSTOM_HID_RegisterInterface(USBD_HandleTypeDef   *pdev,
                                           USBD_CUSTOM_HID_ItfTypeDef *fops)
{
  uint8_t  ret = USBD_FAIL;

  if (fops != NULL)
  {
    pdev->pUserData = fops;
    ret = USBD_OK;
  }

  return ret;
}
/**
  * @}
  */


/**
  * @}
  */


/**
  * @}
  */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/

```



:::

增加 `Composite/Inc/usbd_composite.h` 和  `Composite/Src/usbd_composite.c`，具体可以参考上面的树形结构，可以直接复制内容

### `usbd_composite.h`

::: details 点击展开代码

```c
/**
  ******************************************************************************
  * @file    usbd_composite.h
  * @author  MCD Application Team
  * @brief   Header file for the usbd_composite.c file.
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2015 STMicroelectronics.
  * All rights reserved.</center></h2>
  *
  * This software component is licensed by ST under Ultimate Liberty license
  * SLA0044, the "License"; You may not use this file except in compliance with
  * the License. You may obtain a copy of the License at:
  *                      www.st.com/SLA0044
  *
  ******************************************************************************
  */

/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __USB_COMPOSITE_H
#define __USB_COMPOSITE_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include  "usbd_ioreq.h"

/** @addtogroup STM32_USB_DEVICE_LIBRARY
  * @{
  */

/** @defgroup USBD_COMPOSITE
  * @brief This file is the header file for usbd_composite_core.c
  * @{
  */


/** @defgroup USBD_COMPOSITE_Exported_Defines
  * @{
  */
#define USBD_IAD_DESC_SIZE                        0x08
#define USBD_IAD_DESCRIPTOR_TYPE                  0x0B

#define COMPOSITE_EPIN_ADDR                 0x81
#define COMPOSITE_EPIN_SIZE                 0x10

#define USB_COMPOSITE_CONFIG_DESC_SIZ       107

/**
  * @}
  */
enum
{
  USBD_INTERFACE_CDC_CMD = 0X00,
  USBD_INTERFACE_CDC,
  USBD_INTERFACE_HID,
  USBD_INTERFACE_NUM
};

extern void *pClassDataCDC;
extern void *pClassDataHID;
/** @defgroup USBD_CORE_Exported_TypesDefinitions
  * @{
  */

/**
  * @}
  */



/** @defgroup USBD_CORE_Exported_Macros
  * @{
  */

/**
  * @}
  */

/** @defgroup USBD_CORE_Exported_Variables
  * @{
  */

extern USBD_ClassTypeDef  USBD_COMPOSITE_ClassDriver;
/**
  * @}
  */

/** @defgroup USB_CORE_Exported_Functions
  * @{
  */
/**
  * @}
  */

#ifdef __cplusplus
}
#endif

#endif  /* __USB_COMPOSITE_CORE_H */
/**
  * @}
  */

/**
  * @}
  */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/

```

:::

### `usbd_composite.c`

对于重要的部分我会标识出来

::: details 点击展开代码

```c
/**
  ******************************************************************************
  * @file    usbd_composite.c
  * @author  MCD Application Team
  * @brief   This file provides the HID core functions.
  *
  * @verbatim
  *
  *          ===================================================================
  *                                COMPOSITE Class  Description
  *          ===================================================================
  *
  *
  *
  *
  *
  *
  * @note     In HS mode and when the DMA is used, all variables and data structures
  *           dealing with the DMA during the transaction process should be 32-bit aligned.
  *
  *
  *  @endverbatim
  *
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2015 STMicroelectronics.
  * All rights reserved.</center></h2>
  *
  * This software component is licensed by ST under Ultimate Liberty license
  * SLA0044, the "License"; You may not use this file except in compliance with
  * the License. You may obtain a copy of the License at:
  *                      www.st.com/SLA0044
  *
  ******************************************************************************
  */

/* Includes ------------------------------------------------------------------*/
#include "usbd_composite.h"	// [!code highlight:5]
#include "usbd_ctlreq.h"

#include "usbd_customhid.h"
#include "usbd_cdc.h"
/** @addtogroup STM32_USB_DEVICE_LIBRARY
  * @{
  */


/** @defgroup USBD_COMPOSITE
  * @brief usbd core module
  * @{
  */

/** @defgroup USBD_COMPOSITE_Private_TypesDefinitions
  * @{
  */
/**
  * @}
  */


/** @defgroup USBD_COMPOSITE_Private_Defines
  * @{
  */
void *pClassDataCDC=NULL;
void *pClassDataHID=NULL;

extern USBD_CUSTOM_HID_ItfTypeDef USBD_CustomHID_fops_FS;	// [!code highlight:4]
extern USBD_CDC_ItfTypeDef USBD_Interface_fops_FS;

#define USBD_CDC_fops_FS USBD_Interface_fops_FS;
// USBD_CDC_HandleTypeDef *pClassDataCDC=NULL;
// USBD_CUSTOM_HID_HandleTypeDef *pClassDataHID=NULL;
/**
  * @}
  */


/** @defgroup USBD_COMPOSITE_Private_Macros
  * @{
  */

/**
  * @}
  */




/** @defgroup USBD_COMPOSITE_Private_FunctionPrototypes
  * @{
  */


static uint8_t  USBD_COMPOSITE_Init(USBD_HandleTypeDef *pdev,
                                   uint8_t cfgidx);

static uint8_t  USBD_COMPOSITE_DeInit(USBD_HandleTypeDef *pdev,
                                     uint8_t cfgidx);

static uint8_t  USBD_COMPOSITE_Setup(USBD_HandleTypeDef *pdev,
                                    USBD_SetupReqTypedef *req);

static uint8_t  *USBD_COMPOSITE_GetCfgDesc(uint16_t *length);

static uint8_t  *USBD_COMPOSITE_GetDeviceQualifierDesc(uint16_t *length);

static uint8_t  USBD_COMPOSITE_DataIn(USBD_HandleTypeDef *pdev, uint8_t epnum);

static uint8_t  USBD_COMPOSITE_DataOut(USBD_HandleTypeDef *pdev, uint8_t epnum);

static uint8_t  USBD_COMPOSITE_EP0_RxReady(USBD_HandleTypeDef *pdev);

// static uint8_t  USBD_COMPOSITE_EP0_TxReady(USBD_HandleTypeDef *pdev);

// static uint8_t  USBD_COMPOSITE_SOF(USBD_HandleTypeDef *pdev);

// static uint8_t  USBD_COMPOSITE_IsoINIncomplete(USBD_HandleTypeDef *pdev, uint8_t epnum);

// static uint8_t  USBD_COMPOSITE_IsoOutIncomplete(USBD_HandleTypeDef *pdev, uint8_t epnum);

/**
  * @}
  */

/** @defgroup USBD_COMPOSITE_Private_Variables
  * @{
  */

USBD_ClassTypeDef  USBD_COMPOSITE_ClassDriver =
{
  USBD_COMPOSITE_Init,
  USBD_COMPOSITE_DeInit,
  USBD_COMPOSITE_Setup,
  NULL,//USBD_COMPOSITE_EP0_TxReady,
  USBD_COMPOSITE_EP0_RxReady,
  USBD_COMPOSITE_DataIn,
  USBD_COMPOSITE_DataOut,
  NULL,//USBD_COMPOSITE_SOF,
  NULL,//USBD_COMPOSITE_IsoINIncomplete,
  NULL,//USBD_COMPOSITE_IsoOutIncomplete,
  NULL,//USBD_COMPOSITE_GetCfgDesc,
  USBD_COMPOSITE_GetCfgDesc,
  NULL,//USBD_COMPOSITE_GetCfgDesc,
  USBD_COMPOSITE_GetDeviceQualifierDesc,
};

#if defined ( __ICCARM__ ) /*!< IAR Compiler */
#pragma data_alignment=4
#endif
/* USB COMPOSITE device Configuration Descriptor */
static uint8_t USBD_COMPOSITE_CfgDesc[USB_COMPOSITE_CONFIG_DESC_SIZ] =
{
  0x09,                        /* bLength: Configuration Descriptor size */
  USB_DESC_TYPE_CONFIGURATION, /* bDescriptorType: Configuration */
  USB_COMPOSITE_CONFIG_DESC_SIZ,
  /* wTotalLength: Bytes returned */
  0x00,
  USBD_INTERFACE_NUM, /*bNumInterfaces: 1 interface*/
  0x01,               /*bConfigurationValue: Configuration value*/
  0x00,               /*iConfiguration: Index of string descriptor describing
        the configuration*/
  0x80,               /*bmAttributes: bus powered */
  0x64,               /*MaxPower 100 mA: this current is used for detecting Vbus*/

  /******** /IAD should be positioned just before the CDC interfaces ******
            IAD to associate the two CDC interfaces */

  USBD_IAD_DESC_SIZE,       /* bLength */	// [!code highlight:2]
  USBD_IAD_DESCRIPTOR_TYPE, /* bDescriptorType IAD描述符类型*/
  0x00,                     /* bFirstInterface 接口描述符是要在总的配置描述符中的第几个 0开始数*/
  0x02,                     /* bInterfaceCount 接口描述符数量*/
  0x02,                     /* bFunctionClass 设备中的bDeviceClass*/
  0x02,                     /* bFunctionSubClass 设备符中的bDeviceSubClass*/
  0x01,                     /* bFunctionProtocol 设备符中的bDevicePreotocol*/
  0x00,                     /* iFunction (Index of string descriptor describing this function) */
  /**/

  /*---------------------------------------------------------------------------*/
  /*Interface Descriptor */
  0x09,                    /* bLength: Interface Descriptor size */
  USB_DESC_TYPE_INTERFACE, /* bDescriptorType: Interface */	// [!code highlight:3]
  /* Interface descriptor type */
  USBD_INTERFACE_CDC_CMD, /* bInterfaceNumber: Number of Interface */
  0x00,                   /* bAlternateSetting: Alternate setting */
  0x01,                   /* bNumEndpoints: One endpoints used */
  0x02,                   /* bInterfaceClass: Communication Interface Class */
  0x02,                   /* bInterfaceSubClass: Abstract Control Model */
  0x01,                   /* bInterfaceProtocol: Common AT commands */
  0x00,                   /* iInterface: */

  /*Header Functional Descriptor*/
  0x05, /* bLength: Endpoint Descriptor size */
  0x24, /* bDescriptorType: CS_INTERFACE */
  0x00, /* bDescriptorSubtype: Header Func Desc */
  0x10, /* bcdCDC: spec release number */
  0x01,

  /*Call Management Functional Descriptor*/
  0x05, /* bFunctionLength */
  0x24, /* bDescriptorType: CS_INTERFACE */
  0x01, /* bDescriptorSubtype: Call Management Func Desc */
  0x00, /* bmCapabilities: D0+D1 */
  0x01, /* bDataInterface: 1 */

  /*ACM Functional Descriptor*/
  0x04, /* bFunctionLength */
  0x24, /* bDescriptorType: CS_INTERFACE */
  0x02, /* bDescriptorSubtype: Abstract Control Management desc */
  0x02, /* bmCapabilities */

  /*Union Functional Descriptor*/
  0x05, /* bFunctionLength */
  0x24, /* bDescriptorType: CS_INTERFACE */
  0x06, /* bDescriptorSubtype: Union func desc */
  0x00, /* bMasterInterface: Communication class interface */
  0x01, /* bSlaveInterface0: Data Class Interface */

  /*Endpoint 2 Descriptor*/
  0x07,                        /* bLength: Endpoint Descriptor size */
  USB_DESC_TYPE_ENDPOINT,      /* bDescriptorType: Endpoint */
  CDC_CMD_EP,                  /* bEndpointAddress */
  0x03,                        /* bmAttributes: Interrupt */
  LOBYTE(CDC_CMD_PACKET_SIZE), /* wMaxPacketSize: */
  HIBYTE(CDC_CMD_PACKET_SIZE),
  CDC_HS_BINTERVAL, /* bInterval: */
  /*---------------------------------------------------------------------------*/

  /*Data class interface descriptor*/
  0x09,                    /* bLength: Endpoint Descriptor size */
  USB_DESC_TYPE_INTERFACE, /* bDescriptorType: */	// [!code highlight:2]
  USBD_INTERFACE_CDC,      /* bInterfaceNumber: Number of Interface */
  0x00,                    /* bAlternateSetting: Alternate setting */
  0x02,                    /* bNumEndpoints: Two endpoints used */
  0x0A,                    /* bInterfaceClass: CDC */
  0x00,                    /* bInterfaceSubClass: */
  0x00,                    /* bInterfaceProtocol: */
  0x00,                    /* iInterface: */

  /*Endpoint OUT Descriptor*/
  0x07,                                /* bLength: Endpoint Descriptor size */
  USB_DESC_TYPE_ENDPOINT,              /* bDescriptorType: Endpoint */
  CDC_OUT_EP,                          /* bEndpointAddress */
  0x02,                                /* bmAttributes: Bulk */
  LOBYTE(CDC_DATA_HS_MAX_PACKET_SIZE), /* wMaxPacketSize: */
  HIBYTE(CDC_DATA_HS_MAX_PACKET_SIZE),
  0x00, /* bInterval: ignore for Bulk transfer */

  /*Endpoint IN Descriptor*/
  0x07,                                /* bLength: Endpoint Descriptor size */
  USB_DESC_TYPE_ENDPOINT,              /* bDescriptorType: Endpoint */
  CDC_IN_EP,                           /* bEndpointAddress */
  0x02,                                /* bmAttributes: Bulk */
  LOBYTE(CDC_DATA_HS_MAX_PACKET_SIZE), /* wMaxPacketSize: */
  HIBYTE(CDC_DATA_HS_MAX_PACKET_SIZE),
  0x00, /* bInterval: ignore for Bulk transfer */
  /*107*/

  // HID
  /************** Descriptor of CUSTOM HID interface ****************/
  /* 09 */
  0x09,         /*bLength: Interface Descriptor size*/
  USB_DESC_TYPE_INTERFACE,/*bDescriptorType: Interface descriptor type*/	// [!code highlight:2]
  USBD_INTERFACE_HID,          /*bInterfaceNumber: Number of Interface*/
  0x00,         /*bAlternateSetting: Alternate setting*/
  0x02,         /*bNumEndpoints*/
  0x03,         /*bInterfaceClass: CUSTOM_HID*/
  0x01,         /*bInterfaceSubClass : 1=BOOT, 0=no boot*/
  0x01,         /*nInterfaceProtocol : 0=none, 1=keyboard, 2=mouse*/
  0,            /*iInterface: Index of string descriptor*/
  /******************** Descriptor of CUSTOM_HID *************************/
  /* 18 */
  0x09,         /*bLength: CUSTOM_HID Descriptor size*/
  CUSTOM_HID_DESCRIPTOR_TYPE, /*bDescriptorType: CUSTOM_HID*/
  0x11,         /*bCUSTOM_HIDUSTOM_HID: CUSTOM_HID Class Spec release number*/
  0x01,
  0x00,         /*bCountryCode: Hardware target country*/
  0x01,         /*bNumDescriptors: Number of CUSTOM_HID class descriptors to follow*/
  0x22,         /*bDescriptorType*/
  USBD_CUSTOM_HID_REPORT_DESC_SIZE,/*wItemLength: Total length of Report descriptor*/
  0x00,
  /******************** Descriptor of Custom HID endpoints ********************/
  /* 27 */
  0x07,          /*bLength: Endpoint Descriptor size*/
  USB_DESC_TYPE_ENDPOINT, /*bDescriptorType:*/

  CUSTOM_HID_EPIN_ADDR,     /*bEndpointAddress: Endpoint Address (IN)*/
  0x03,          /*bmAttributes: Interrupt endpoint*/
  CUSTOM_HID_EPIN_SIZE, /*wMaxPacketSize: 2 Byte max */
  0x00,
  CUSTOM_HID_FS_BINTERVAL,          /*bInterval: Polling Interval */
  /* 34 */

  0x07,          /* bLength: Endpoint Descriptor size */
  USB_DESC_TYPE_ENDPOINT, /* bDescriptorType: */
  CUSTOM_HID_EPOUT_ADDR,  /*bEndpointAddress: Endpoint Address (OUT)*/
  0x03, /* bmAttributes: Interrupt endpoint */
  CUSTOM_HID_EPOUT_SIZE,  /* wMaxPacketSize: 2 Bytes max  */
  0x00,
  CUSTOM_HID_FS_BINTERVAL,  /* bInterval: Polling Interval */
  /* 41 */
};

#if defined ( __ICCARM__ ) /*!< IAR Compiler */
#pragma data_alignment=4
#endif
/* USB Standard Device Descriptor */
static uint8_t USBD_COMPOSITE_DeviceQualifierDesc[USB_LEN_DEV_QUALIFIER_DESC] =
{
  USB_LEN_DEV_QUALIFIER_DESC,
  USB_DESC_TYPE_DEVICE_QUALIFIER,
  0x00,
  0x02,
  0x00,
  0x00,
  0x00,
  0x40,
  0x01,
  0x00,
};

/**
  * @}
  */

/** @defgroup USBD_COMPOSITE_Private_Functions
  * @{
  */

/**
  * @brief  USBD_COMPOSITE_Init
  *         Initialize the COMPOSITE interface
  * @param  pdev: device instance
  * @param  cfgidx: Configuration index
  * @retval status
  */
static uint8_t  USBD_COMPOSITE_Init(USBD_HandleTypeDef *pdev,
                                   uint8_t cfgidx)
{
  uint8_t ret = 0;
  /*CDC*/	// [!code highlight:9]
  pdev->pUserData = (void *)&USBD_CDC_fops_FS;
  ret += USBD_CDC.Init(pdev, cfgidx);
  pClassDataCDC = pdev->pClassData;

  /*HID*/
  pdev->pUserData = (void *)&USBD_CustomHID_fops_FS;
  ret += USBD_CUSTOM_HID.Init(pdev, cfgidx);
  pClassDataHID = pdev->pClassData;
  return ret;
}

/**
  * @brief  USBD_COMPOSITE_Init
  *         DeInitialize the COMPOSITE layer
  * @param  pdev: device instance
  * @param  cfgidx: Configuration index
  * @retval status
  */
static uint8_t  USBD_COMPOSITE_DeInit(USBD_HandleTypeDef *pdev,
                                     uint8_t cfgidx)
{
  pdev->pClassData = pClassDataCDC;	// [!code highlight:7]
  pdev->pUserData = (void *)&USBD_CDC_fops_FS;
  USBD_CDC.DeInit(pdev, cfgidx);

  pdev->pClassData = pClassDataHID;
  pdev->pUserData = (void *)&USBD_CustomHID_fops_FS;
  USBD_CUSTOM_HID.DeInit(pdev, cfgidx);

  return USBD_OK;
}

/**
  * @brief  USBD_COMPOSITE_Setup
  *         Handle the COMPOSITE specific requests
  * @param  pdev: instance
  * @param  req: usb requests
  * @retval status
  */
static uint8_t  USBD_COMPOSITE_Setup(USBD_HandleTypeDef *pdev,
                                    USBD_SetupReqTypedef *req)
{
  USBD_StatusTypeDef ret = USBD_OK;

  switch (req->bmRequest & USB_REQ_RECIPIENT_MASK)
  {
   case USB_REQ_RECIPIENT_INTERFACE:
    switch(req->wIndex)
    {
      case USBD_INTERFACE_CDC:	// [!code highlight:9]
      case USBD_INTERFACE_CDC_CMD:
        pdev->pClassData = pClassDataCDC;
        pdev->pUserData =  (void *)&USBD_Interface_fops_FS;
        return(USBD_CDC.Setup(pdev, req));
      case USBD_INTERFACE_HID:
        pdev->pClassData = pClassDataHID;
        pdev->pUserData =  (void *)&USBD_CustomHID_fops_FS;
        return(USBD_CUSTOM_HID.Setup (pdev, req));
      default:
        break;
    }
    break;
   case USB_REQ_RECIPIENT_ENDPOINT:
     switch(req->wIndex)
     {
        case CDC_IN_EP:	// [!code highlight:11]
        case CDC_OUT_EP:
        case CDC_CMD_EP:
          pdev->pClassData = pClassDataCDC;
          pdev->pUserData = (void *)&USBD_Interface_fops_FS;
          return(USBD_CDC.Setup(pdev, req));
        case CUSTOM_HID_EPIN_ADDR:
        case CUSTOM_HID_EPOUT_ADDR:
          pdev->pClassData = pClassDataHID;
          pdev->pUserData = (void *)&USBD_CustomHID_fops_FS;
          return(USBD_CUSTOM_HID.Setup (pdev, req));
        default:
          break;
     }
     break;
  }
  return ret;
}


/**
  * @brief  USBD_COMPOSITE_GetCfgDesc
  *         return configuration descriptor
  * @param  length : pointer data length
  * @retval pointer to descriptor buffer
  */
static uint8_t  *USBD_COMPOSITE_GetCfgDesc(uint16_t *length)
{
  *length = sizeof(USBD_COMPOSITE_CfgDesc);
  return USBD_COMPOSITE_CfgDesc;
}

/**
* @brief  DeviceQualifierDescriptor
*         return Device Qualifier descriptor
* @param  length : pointer data length
* @retval pointer to descriptor buffer
*/
uint8_t  *USBD_COMPOSITE_DeviceQualifierDescriptor(uint16_t *length)
{
  *length = sizeof(USBD_COMPOSITE_DeviceQualifierDesc);
  return USBD_COMPOSITE_DeviceQualifierDesc;
}


/**
  * @brief  USBD_COMPOSITE_DataIn
  *         handle data IN Stage
  * @param  pdev: device instance
  * @param  epnum: endpoint index
  * @retval status
  */
static uint8_t  USBD_COMPOSITE_DataIn(USBD_HandleTypeDef *pdev,
                                     uint8_t epnum)
{
  switch (epnum)
  {
  case (CDC_IN_EP & 0x0f):	// [!code highlight:9]
    pdev->pClassData = pClassDataCDC;
    pdev->pUserData = (void *)&USBD_CDC_fops_FS;
    USBD_CDC.DataIn(pdev, epnum);
    break;
  case (CUSTOM_HID_EPIN_ADDR & 0x0f):
    pdev->pClassData = pClassDataHID;
    pdev->pUserData = (void *)&USBD_CustomHID_fops_FS;
    USBD_CUSTOM_HID.DataIn(pdev, epnum);
    break;
  default:
    break;
  }
  return USBD_FAIL;
}

/**
  * @brief  USBD_COMPOSITE_EP0_RxReady
  *         handle EP0 Rx Ready event
  * @param  pdev: device instance
  * @retval status
  */
static uint8_t  USBD_COMPOSITE_EP0_RxReady(USBD_HandleTypeDef *pdev)
{
  return USBD_CDC.EP0_RxReady(pdev);
  // return USBD_OK;
}
/**
  * @brief  USBD_COMPOSITE_EP0_TxReady
  *         handle EP0 TRx Ready event
  * @param  pdev: device instance
  * @retval status
  */
// static uint8_t  USBD_COMPOSITE_EP0_TxReady(USBD_HandleTypeDef *pdev)
// {

//   return USBD_OK;
// }
/**
  * @brief  USBD_COMPOSITE_SOF
  *         handle SOF event
  * @param  pdev: device instance
  * @retval status
  */
// static uint8_t  USBD_COMPOSITE_SOF(USBD_HandleTypeDef *pdev)
// {

//   return USBD_OK;
// }
/**
  * @brief  USBD_COMPOSITE_IsoINIncomplete
  *         handle data ISO IN Incomplete event
  * @param  pdev: device instance
  * @param  epnum: endpoint index
  * @retval status
  */
// static uint8_t  USBD_COMPOSITE_IsoINIncomplete(USBD_HandleTypeDef *pdev, uint8_t epnum)
// {

//   return USBD_OK;
// }
/**
  * @brief  USBD_COMPOSITE_IsoOutIncomplete
  *         handle data ISO OUT Incomplete event
  * @param  pdev: device instance
  * @param  epnum: endpoint index
  * @retval status
  */
// static uint8_t  USBD_COMPOSITE_IsoOutIncomplete(USBD_HandleTypeDef *pdev, uint8_t epnum)
// {

//   return USBD_OK;
// }
/**
  * @brief  USBD_COMPOSITE_DataOut
  *         handle data OUT Stage
  * @param  pdev: device instance
  * @param  epnum: endpoint index
  * @retval status
  */
static uint8_t  USBD_COMPOSITE_DataOut(USBD_HandleTypeDef *pdev,
                                      uint8_t epnum)
{
  switch(epnum)
  {
    case (CDC_OUT_EP & 0x0f):	// [!code highlight:9]
    case (CDC_CMD_EP & 0x0f):
      pdev->pClassData = pClassDataCDC;
      pdev->pUserData = (void *)&USBD_Interface_fops_FS;
      return(USBD_CDC.DataOut(pdev,epnum));
    case (CUSTOM_HID_EPOUT_ADDR & 0x0f):
      pdev->pClassData = pClassDataHID;
      pdev->pUserData =  (void *)&USBD_CustomHID_fops_FS;
      return(USBD_CUSTOM_HID.DataOut(pdev,epnum));
    default:
        break;
  }
  return USBD_FAIL;
}

/**
* @brief  DeviceQualifierDescriptor
*         return Device Qualifier descriptor
* @param  length : pointer data length
* @retval pointer to descriptor buffer
*/
uint8_t  *USBD_COMPOSITE_GetDeviceQualifierDesc(uint16_t *length)
{
  *length = sizeof(USBD_COMPOSITE_DeviceQualifierDesc);
  return USBD_COMPOSITE_DeviceQualifierDesc;
}

/**
  * @}
  */


/**
  * @}
  */


/**
  * @}
  */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/

```



:::

### 修改 `USB_DEVICE/Target/usbd_conf.c` 

配置 CDC 和 CustomHID 设备端点

```c

/**
  * @brief  Initializes the low level portion of the device driver.
  * @param  pdev: Device handle
  * @retval USBD status
  */
USBD_StatusTypeDef USBD_LL_Init(USBD_HandleTypeDef *pdev)
{
  /* Init USB Ip. */
  /* Link the driver to the stack. */
  hpcd_USB_FS.pData = pdev;
  pdev->pData = &hpcd_USB_FS;

  hpcd_USB_FS.Instance = USB;
  hpcd_USB_FS.Init.dev_endpoints = 8;
  hpcd_USB_FS.Init.speed = PCD_SPEED_FULL;
  hpcd_USB_FS.Init.low_power_enable = DISABLE;
  hpcd_USB_FS.Init.lpm_enable = DISABLE;
  hpcd_USB_FS.Init.battery_charging_enable = DISABLE;
  if (HAL_PCD_Init(&hpcd_USB_FS) != HAL_OK)
  {
    Error_Handler( );
  }

#if (USE_HAL_PCD_REGISTER_CALLBACKS == 1U)
  /* Register USB PCD CallBacks */
  HAL_PCD_RegisterCallback(&hpcd_USB_FS, HAL_PCD_SOF_CB_ID, PCD_SOFCallback);
  HAL_PCD_RegisterCallback(&hpcd_USB_FS, HAL_PCD_SETUPSTAGE_CB_ID, PCD_SetupStageCallback);
  HAL_PCD_RegisterCallback(&hpcd_USB_FS, HAL_PCD_RESET_CB_ID, PCD_ResetCallback);
  HAL_PCD_RegisterCallback(&hpcd_USB_FS, HAL_PCD_SUSPEND_CB_ID, PCD_SuspendCallback);
  HAL_PCD_RegisterCallback(&hpcd_USB_FS, HAL_PCD_RESUME_CB_ID, PCD_ResumeCallback);
  HAL_PCD_RegisterCallback(&hpcd_USB_FS, HAL_PCD_CONNECT_CB_ID, PCD_ConnectCallback);
  HAL_PCD_RegisterCallback(&hpcd_USB_FS, HAL_PCD_DISCONNECT_CB_ID, PCD_DisconnectCallback);

  HAL_PCD_RegisterDataOutStageCallback(&hpcd_USB_FS, PCD_DataOutStageCallback);
  HAL_PCD_RegisterDataInStageCallback(&hpcd_USB_FS, PCD_DataInStageCallback);
  HAL_PCD_RegisterIsoOutIncpltCallback(&hpcd_USB_FS, PCD_ISOOUTIncompleteCallback);
  HAL_PCD_RegisterIsoInIncpltCallback(&hpcd_USB_FS, PCD_ISOINIncompleteCallback);
#endif /* USE_HAL_PCD_REGISTER_CALLBACKS */
  /* USER CODE BEGIN EndPoint_Configuration */
  HAL_PCDEx_PMAConfig((PCD_HandleTypeDef*)pdev->pData , 0x00 , PCD_SNG_BUF, 0x18);
  HAL_PCDEx_PMAConfig((PCD_HandleTypeDef*)pdev->pData , 0x80 , PCD_SNG_BUF, 0x58);
  /* USER CODE END EndPoint_Configuration */
  /* USER CODE BEGIN EndPoint_Configuration_USER */
  HAL_PCDEx_PMAConfig((PCD_HandleTypeDef*)pdev->pData , CDC_IN_EP , PCD_SNG_BUF, 0xC0);	// [!code highlight:6]
  HAL_PCDEx_PMAConfig((PCD_HandleTypeDef*)pdev->pData , CDC_OUT_EP , PCD_SNG_BUF, 0x110);
  HAL_PCDEx_PMAConfig((PCD_HandleTypeDef*)pdev->pData , CDC_CMD_EP , PCD_SNG_BUF, 0x100);

  HAL_PCDEx_PMAConfig((PCD_HandleTypeDef*)pdev->pData , CUSTOM_HID_EPIN_ADDR , PCD_SNG_BUF, 0x140);
  HAL_PCDEx_PMAConfig((PCD_HandleTypeDef*)pdev->pData , CUSTOM_HID_EPOUT_ADDR , PCD_SNG_BUF, 0x180);
  /* USER CODE END EndPoint_Configuration_USER */
  return USBD_OK;
}
```

此篇文章到此就结束了，如果有朋友在阅读和尝试的过程中发现没有描述到的问题，请反馈给我，我会进行优化