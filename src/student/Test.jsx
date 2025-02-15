import React from 'react';

export default function View() {
  return (
    <div>
      <h1>校园车辆管理系统</h1>

      <div>
        <h2>学生车辆登记进校</h2>
        <table>
          <thead>
            <tr>
              <th>车牌号</th>
              <th>车辆类型</th>
              <th>车主姓名</th>
              <th>联系方式</th>
              <th>进校时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>京A12345</td>
              <td>小轿车</td>
              <td>张三</td>
              <td>12345678901</td>
              <td>2025-02-14 08:00</td>
            </tr>
            <tr>
              <td>京B67890</td>
              <td>电动车</td>
              <td>李四</td>
              <td>10987654321</td>
              <td>2025-02-14 09:00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>违规信息</h2>
        <table>
          <thead>
            <tr>
              <th>车牌号</th>
              <th>违规类型</th>
              <th>违规时间</th>
              <th>处理状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>京A12345</td>
              <td>超速</td>
              <td>2025-02-13 14:00</td>
              <td>已处理</td>
            </tr>
            <tr>
              <td>京B67890</td>
              <td>违停</td>
              <td>2025-02-12 10:00</td>
              <td>未处理</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>申请车辆流转信息</h2>
        <table>
          <thead>
            <tr>
              <th>申请人</th>
              <th>车牌号</th>
              <th>申请时间</th>
              <th>流转状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>张三</td>
              <td>京A12345</td>
              <td>2025-02-10 12:00</td>
              <td>已批准</td>
            </tr>
            <tr>
              <td>李四</td>
              <td>京B67890</td>
              <td>2025-02-11 15:00</td>
              <td>待审核</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>添加新车辆</h2>
        <form>
          <div>
            <label>车牌号:</label>
            <input type="text" name="licensePlate" />
          </div>
          <div>
            <label>车辆类型:</label>
            <input type="text" name="vehicleType" />
          </div>
          <div>
            <label>车主姓名:</label>
            <input type="text" name="ownerName" />
          </div>
          <div>
            <label>联系方式:</label>
            <input type="text" name="contact" />
          </div>
          <button type="submit">添加车辆</button>
        </form>
      </div>
    </div>
  );
}
