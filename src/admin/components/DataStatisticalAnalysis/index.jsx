import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Table, Layout, Typography, Row, Col, Pagination, Select, Button, DatePicker } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 生成最近30天的日期
function generateDates(days = 30) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// 模拟数据 - 最近30天内的车辆违规记录
const generateVehicleViolationRecords = () => {
  const dates = generateDates(30);
  const locations = ['东二门', '南门', '东一门', '人工上报'];
  const violations = ['超速', '未登记', '超载', '违停'];
  const sources = ['机器上报', '人工上报'];

  const records = [];
  dates.forEach(date => {
    locations.forEach(location => {
      violations.forEach(violation => {
        const source = sources[Math.floor(Math.random() * sources.length)];
        const count = Math.floor(Math.random() * 10) + 1;
        records.push({ date, location, violation, source, count });
      });
    });
  });
  return records;
};

const vehicleViolationRecords = generateVehicleViolationRecords();

// 生成折线图数据
function generateLineChartData(records, timeDimension) {
  let data = [];

  if (timeDimension === 'day') {
    const dailyData = {};
    records.forEach(record => {
      if (!dailyData[record.date]) {
        dailyData[record.date] = {};
      }
      if (!dailyData[record.date][record.violation]) {
        dailyData[record.date][record.violation] = 0;
      }
      dailyData[record.date][record.violation] += record.count;
    });

    const dates = Object.keys(dailyData).sort();
    data = dates.map(date => ({
      date,
      ...dailyData[date],
    }));
  } else if (timeDimension === 'week') {
    const weeklyData = {};
    records.forEach(record => {
      const weekNumber = Math.floor(new Date(record.date).getDate() / 7);
      const weekKey = `${record.date.substring(0, 8)}-W${weekNumber + 1}`;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {};
      }
      if (!weeklyData[weekKey][record.violation]) {
        weeklyData[weekKey][record.violation] = 0;
      }
      weeklyData[weekKey][record.violation] += record.count;
    });

    data = Object.keys(weeklyData)
      .sort()
      .map(weekKey => ({
        week: weekKey,
        ...weeklyData[weekKey],
      }));
  } else if (timeDimension === 'month') {
    const monthlyData = {};
    records.forEach(record => {
      const monthKey = record.date.substring(0, 7);

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      if (!monthlyData[monthKey][record.violation]) {
        monthlyData[monthKey][record.violation] = 0;
      }
      monthlyData[monthKey][record.violation] += record.count;
    });

    data = Object.keys(monthlyData)
      .sort()
      .map(monthKey => ({
        month: monthKey,
        ...monthlyData[monthKey],
      }));
  }

  return data;
}

// 生成饼图数据
function generatePieData(records) {
  const violationCounts = {};
  records.forEach(record => {
    violationCounts[record.violation] = (violationCounts[record.violation] || 0) + record.count;
  });

  return Object.entries(violationCounts).map(([violation, count]) => ({
    name: violation,
    value: count,
  }));
}

export default function DataStatisticalAnalysis() {
  const [timeDimension, setTimeDimension] = useState('day'); // 默认为天视图
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState(null); // 日期范围
  const [filteredRecords, setFilteredRecords] = useState(vehicleViolationRecords);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const columns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '地点', dataIndex: 'location', key: 'location' },
    { title: '违规行为', dataIndex: 'violation', key: 'violation' },
    { title: '来源', dataIndex: 'source', key: 'source' },
    { title: '次数', dataIndex: 'count', key: 'count' },
  ];

  // 根据日期范围筛选记录
  useEffect(() => {
    if (!dateRange) {
      setFilteredRecords(vehicleViolationRecords);
      return;
    }

    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');

    const newFilteredRecords = vehicleViolationRecords.filter(record => {
      return record.date >= startDate && record.date <= endDate;
    });

    setFilteredRecords(newFilteredRecords);
  }, [dateRange]);

  return (
    <Layout className="data-statistical-analysis">
      <Content style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="违规数据可视化">
              <div
                className="chart-controls"
                style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}
              >
                <div>
                  <span style={{ marginRight: '10px' }}>统计维度：</span>
                  <Select value={timeDimension} style={{ width: 120 }} onChange={setTimeDimension}>
                    <Option value="day">日</Option>
                    <Option value="week">周</Option>
                    <Option value="month">月</Option>
                  </Select>
                </div>
                <div>
                  <span style={{ marginRight: '10px' }}>日期范围：</span>
                  <RangePicker
                    onChange={setDateRange}
                    onPanelChange={setDateRange}
                    style={{ width: 300 }}
                    format="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      setDateRange(null);
                      setFilteredRecords(vehicleViolationRecords);
                    }}
                  >
                    重置
                  </Button>
                </div>
              </div>

              <div>
                <h3>违规数据变化趋势图</h3>
                <ReactECharts
                  option={getLineChartOption()}
                  style={{ height: '400px', width: '100%', marginTop: '20px' }}
                />
              </div>
              <div style={{ marginTop: '20px' }}>
                <h3>违规类型占比统计</h3>
                <ReactECharts
                  option={getPieChartOption()}
                  style={{ height: '400px', width: '100%', marginTop: '20px' }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="30天违规记录" style={{ marginTop: '24px' }}>
          <Table
            columns={columns}
            dataSource={currentRecords.map((record, index) => ({ ...record, key: index }))}
            pagination={false}
          />
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Pagination
              current={currentPage}
              onChange={page => setCurrentPage(page)}
              total={filteredRecords.length}
              pageSize={recordsPerPage}
            />
          </div>
        </Card>

        <Card title="校园车辆治理建议" style={{ marginTop: '24px' }}>
          <ul style={{ fontSize: '16px', lineHeight: '2' }}>
            <li>在违规高发地点（如东二门、南门等）增加监控设备或人员巡查，以加强对超速和未登记车辆的监控。</li>
            <li>考虑设置限速警示牌，提醒驾驶者减速行车，尤其是在校园主出入口和其他人流密集区域。</li>
            <li>定期更新和宣传校园车辆管理规定，提升师生对违规行为危害性的认识。</li>
            <li>为人工上报违规情况的师生提供便捷的反馈渠道，鼓励更多的参与和监督。</li>
            <li>对频繁违规的车辆进行追踪管理，与相关车主进行沟通，了解具体原因，并制定针对性的改进措施。</li>
          </ul>
        </Card>
      </Content>
    </Layout>
  );

  // 获取折线图配置
  function getLineChartOption() {
    const lineChartData = generateLineChartData(filteredRecords, timeDimension);

    // 根据时间维度设置X轴标签
    let xAxisLabel = '';
    if (timeDimension === 'day') {
      xAxisLabel = '日期';
    } else if (timeDimension === 'week') {
      xAxisLabel = '周';
    } else if (timeDimension === 'month') {
      xAxisLabel = '月';
    }

    // 获取所有违规类型
    const violations = ['超速', '未登记', '超载', '违停'];
    let xAxisData = [];
    if (timeDimension === 'day') {
      xAxisData = lineChartData.map(item => item.date);
    } else if (timeDimension === 'week') {
      xAxisData = lineChartData.map(item => item.week);
    } else if (timeDimension === 'month') {
      xAxisData = lineChartData.map(item => item.month);
    }

    const seriesData = violations.map(violation => ({
      name: violation,
      type: 'line',
      data: lineChartData.map(item => item[violation] || 0),
      smooth: true,
    }));

    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: violations,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: '违规次数',
      },
      series: seriesData,
    };
  }

  // 获取饼图配置
  function getPieChartOption() {
    const pieData = generatePieData(filteredRecords);
    return {
      title: {
        text: '校园车辆违规类型统计',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: pieData.map(item => item.name),
      },
      series: [
        {
          name: '车辆违规次数',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          data: pieData,
        },
      ],
    };
  }
}
