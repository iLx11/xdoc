### 在线教程和博客
**CBOR in Python:**
    - [Python cbor2 Library](https://pypi.org/project/cbor2/)
    - [Python CBOR Example](https://cbor.readthedocs.io/en/latest/usage.html)
#### Python
使用`cbor2`库来编码和解码CBOR数据。
```python
import cbor2

# 编码数据
data = {
    "name": "Alice",
    "age": 30,
    "is_student": False,
    "scores": [85, 90, 78]
}

encoded = cbor2.dumps(data)
print(f"Encoded: {encoded}")

# 解码数据
decoded = cbor2.loads(encoded)
print(f"Decoded: {decoded}")

```