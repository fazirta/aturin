import 'package:area51/UI_UX/bar_chart.dart';
import 'package:area51/UI_UX/style.dart';
import 'package:area51/UI_UX/widget.dart';
import 'package:area51/services/data_controller.dart';
import 'package:area51/services/product_category.dart';
import 'package:area51/services/user_database.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final controller = Get.put(DataController());
  final db = Get.find<UserDatabase>();
  int crntIncmPage = 1;
  int crntExpPage = 1;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        margin: EdgeInsets.only(bottom: 50),
        // decoration: BoxDecoration(color: Colors.black87),
        // decoration: BoxDecoration(color: Color.fromARGB(255, 17, 24, 37),),
        child: SingleChildScrollView(
          child: Column(
            children: [
            SizedBox(height:30),
              simpleText("Your Expenses: "),
              _expensesLineChart(context),
              _expensesPieChart(),
              SizedBox(
                width: 450,
                // child: MyBarChart(),
              ),
              _details(),
              _incomeExpenses(),
              SizedBox(
                height: 50,
              )
              // DropDownInfo(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _details() {
    return Container(
      margin: EdgeInsets.all(25),
      padding: EdgeInsets.all(8),
      decoration: aBoxDecoration(),
      child: Column(
        children: [
          Text("Transaction Details"),
          Row(
            children: [
              Expanded(child: Text("Total income:")),
              Expanded(child: Text(Income.totalIncome.toStringAsFixed(2))),
            ],
          ),
          Row(
            children: [
              Expanded(child: Text("Total expenses:")),
              Expanded(child: Text(Expense.totalExpenses.toStringAsFixed(2))),
            ],
          )
        ],
      ),
    );
  }

  Widget _incomeExpenses() {
    final width = MediaQuery.of(context).size.width;
    final incomes = db.incomes;
    final expenses = db.expenses;

    int totIncmPage = (incomes.length / 3).ceil();
    int totExpPage = (expenses.length / 3).ceil();

    return Container(
      width: width - 50,
      padding: EdgeInsets.all(5),
      decoration: aBoxDecoration(),
      child: Column(
        children: [
          // ****************************************
          // INCOMES
          // ****************************************
          Container(
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.all(8.0),
            child: Text("All Incomes"),
          ),
          Row(children: [
            Expanded(child: Text("Name"), flex: 3),
            Expanded(child: Text("Price"), flex: 4),
            Expanded(child: Text("Item"), flex: 4),
            Expanded(child: Text("Date"), flex: 4),
            SizedBox(
              width: 38,
            )
          ]),
          Container(
            height: 70,
            child: ListView.builder(
              itemCount: 3,
              itemBuilder: (context, index) {
                int dataIndex = (crntIncmPage - 1) * 3 + index;
                if (dataIndex < incomes.length) {
                  final inc = incomes[dataIndex];
                  return Container(
                      alignment: Alignment.centerLeft,
                      padding: const EdgeInsets.all(2.0),
                      child: Row(
                        children: [
                          Expanded(child: Text(inc.name), flex: 3),
                          Expanded(child: Text(inc.fPrice), flex: 4),
                          Expanded(child: Text(inc.item), flex: 4),
                          Expanded(child: Text(inc.fDate), flex: 4),
                          Icon(
                            Icons.edit_square,
                            size: 13,
                          ),
                          SizedBox(
                            width: 10,
                          ),
                          Icon(
                            Icons.delete,
                            size: 15,
                          )
                        ],
                      ));
                }
                return Container(
                    // height: 10,
                    // width: 200,
                    );
              },
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              aButton(
                  onPressed: () {
                    if (crntIncmPage > 1) {
                      setState(() {
                        crntIncmPage--;
                      });
                    }
                  },
                  child: simpleText("Previous")),
              Text(
                  "Page $crntIncmPage of ${totIncmPage == 0 ? 1 : totIncmPage}"),
              aButton(
                  onPressed: () {
                    if (crntIncmPage < totIncmPage) {
                      setState(() {
                        crntIncmPage++;
                      });
                    }
                  },
                  child: simpleText("Next"),
                  width: 110),
            ],
          ),
          // ****************************************
          // EXPENSES
          // ****************************************
          Container(
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.all(8.0),
            child: Text("All Expenses"),
          ),
          Row(children: [
            Expanded(child: Text("Desc"), flex: 3),
            Expanded(child: Text("Price"), flex: 4),
            Expanded(child: Text("Category"), flex: 4),
            Expanded(child: Text("Date"), flex: 4),
            SizedBox(
              width: 38,
            )
          ]),
          Container(
            height: 70,
            child: ListView.builder(
              itemCount: 3,
              itemBuilder: (context, index) {
                int dataIndex = (crntExpPage - 1) * 3 + index;
                if (dataIndex < expenses.length) {
                  final exp = expenses[dataIndex];
                  return Container(
                      alignment: Alignment.centerLeft,
                      padding: const EdgeInsets.all(2.0),
                      child: Row(
                        children: [
                          Expanded(child: Text(exp.desc), flex: 3),
                          Expanded(child: Text(exp.fPrice), flex: 4),
                          Expanded(child: Text(exp.category), flex: 4),
                          Expanded(child: Text(exp.fDate), flex: 4),
                          Icon(
                            Icons.edit_square,
                            size: 13,
                          ),
                          SizedBox(
                            width: 10,
                          ),
                          Icon(
                            Icons.delete,
                            size: 15,
                          )
                        ],
                      ));
                }
                return Container(
                    // height: 10,
                    // width: 200,
                    );
              },
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              aButton(
                  onPressed: () {
                    if (crntExpPage > 1) {
                      setState(() {
                        crntExpPage--;
                      });
                    }
                  },
                  child: simpleText("Previous")),
              Text("Page $crntExpPage of ${totExpPage == 0 ? 1 : totExpPage}"),
              aButton(
                  onPressed: () {
                    if (crntExpPage < totExpPage) {
                      setState(() {
                        crntExpPage++;
                      });
                    }
                  },
                  child: simpleText("Next"),
                  width: 110),
            ],
          )
        ],
      ),
    );
  }

  Widget _expensesLineChart(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;

    List<FlSpot> incomeSpots = Income.history.entries
        .map((entry) =>
            FlSpot(double.parse(entry.key.split('/')[2]), entry.value))
        .toList();

    List<FlSpot> expenseSpots = Expense.history.entries
        .map((entry) =>
            FlSpot(double.parse(entry.key.split('/')[2]), entry.value))
        .toList();

    return SizedBox(
      width: width - 50,
      height: 200,
      child: LineChart(
        LineChartData(
          titlesData: FlTitlesData(
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                reservedSize: 35,
                interval: 1,
                getTitlesWidget: (value, meta) {
                  String formattedDate =
                      "07/${value.toInt().toString().padLeft(2, '0')}";
                  return Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: simpleText(formattedDate),
                  );
                },
              ),
            ),
            rightTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            topTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            leftTitles: AxisTitles(
              sideTitles: SideTitles(
                getTitlesWidget: (value, meta) {
                  return simpleText(value.toInt().toString());
                },
                showTitles: true,
                interval: 1000,
                reservedSize: 40,
              ),
            ),
          ),
          borderData: FlBorderData(
            show: true,
            border: Border.all(color: Colors.white),
          ),
          lineBarsData: [
            LineChartBarData(
              isCurved: true,
              color: Colors.green,
              barWidth: 6,
              isStrokeCapRound: true,
              dotData: const FlDotData(show: false),
              belowBarData: BarAreaData(
                show: true,
                color: Colors.green.withOpacity(0.3),
              ),
              spots: incomeSpots,
            ),
            LineChartBarData(
              isCurved: true,
              color: Colors.pink,
              barWidth: 6,
              isStrokeCapRound: true,
              dotData: const FlDotData(show: false),
              belowBarData: BarAreaData(
                show: true,
                color: Colors.pink.withOpacity(0.3),
              ),
              spots: expenseSpots,
            )
          ],
        ),
      ),
    );
  }

  Widget _expensesPieChart() {
    List<PieChartSectionData> sections = [
      PieChartSectionData(
          value: Income.totalIncome,
          title: "Income",
          showTitle: true,
          titleStyle: TextStyle(color: Colors.white),
          radius: 70,
          color: Colors.green),
      PieChartSectionData(
          value: Expense.totalExpenses,
          title: "Expenses",
          titleStyle: TextStyle(color: Colors.white),
          showTitle: true,
          radius: 70,
          color: Colors.pink),
    ];

    return SizedBox(
      height: 300,
      child: PieChart(
        PieChartData(sections: sections, startDegreeOffset: 270),
      ),
    );
  }
}
