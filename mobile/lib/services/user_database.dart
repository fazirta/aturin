import 'package:area51/services/product_category.dart';

class UserDatabase {
  // static final cando = FirebaseFirestore.instance.collection("cando").doc()
  List<Product> products = [
      // Product("haha", 100000, 12),
      // Product("japop", 300000,10),
      // Product("otat", 400000, 14),
      // Product("keju", 350000, 15),
      // Product("cheese", 300000, 11),
    ];
  List<Category> categories= [
    // Category("Motor", "kebutuhan"),
    // Category("Mobil", "kebutuhan"),
    // Category("meong", "kebutuhan"),
    // Category("nash", "kebutuhan"),
    // Category("nya", "kebutuhan"),
    // Category("shika", "kebutuhan"),
    // Category("noko", "kebutuhan"),
    // Category("kobo", "kebutuhan"),
  ];
  List<Income> incomes = [];
  List<Expense> expenses = [];

  void addProduct(Product product){
    products.add(product);
  }

  void addCategory(Category category){
    categories.add(category);
  }


}