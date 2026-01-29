using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Models;

namespace SmartRecipeFinder.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<NutritionInfo> NutritionInfos { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<ShoppingList> ShoppingLists { get; set; }
        public DbSet<AISearchHistory> AISearchHistories { get; set; }
        public DbSet<Allergy> Allergies { get; set; }
        public DbSet<IngredientAllergy> IngredientAllergies { get; set; }
        public DbSet<UserAllergy> UserAllergies { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Favorite>()
    .HasKey(f => new { f.UserId, f.RecipeId });

            modelBuilder.Entity<Favorite>()
    .HasOne(f => f.User)
    .WithMany(u => u.Favorites)
    .HasForeignKey(f => f.UserId)
    .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Recipe)
                .WithMany(r => r.Favorites)
                .HasForeignKey(f => f.RecipeId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<RecipeIngredient>()
    .HasKey(ri => new { ri.RecipeId, ri.IngredientId });

            modelBuilder.Entity<RecipeIngredient>()
                .HasOne(ri => ri.Recipe)
                .WithMany(r => r.RecipeIngredients)
                .HasForeignKey(ri => ri.RecipeId);

            modelBuilder.Entity<RecipeIngredient>()
                .HasOne(ri => ri.Ingredient)
                .WithMany(i => i.RecipeIngredients)
                .HasForeignKey(ri => ri.IngredientId);


            modelBuilder.Entity<Recipe>()
    .HasOne(r => r.CreatedByUser)
    .WithMany()
    .HasForeignKey(r => r.CreatedBy)
    .OnDelete(DeleteBehavior.SetNull);




           
            // 4. Existing Configurations for ShoppingList
            modelBuilder.Entity<ShoppingList>()
                .HasOne(s => s.User)
                .WithMany(u => u.ShoppingLists)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ShoppingList>()
                .HasOne(s => s.Recipe)
                .WithMany(r => r.ShoppingLists)
                .HasForeignKey(s => s.RecipeId)
                .OnDelete(DeleteBehavior.NoAction);

            // ================= ALLERGY MODULE CONFIG =================

            // Ingredient ↔ Allergy (Many-to-Many)
            modelBuilder.Entity<IngredientAllergy>()
                .HasKey(ia => new { ia.IngredientId, ia.AllergyId });

            modelBuilder.Entity<IngredientAllergy>()
                .HasOne(ia => ia.Ingredient)
                .WithMany(i => i.IngredientAllergies)
                .HasForeignKey(ia => ia.IngredientId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<IngredientAllergy>()
                .HasOne(ia => ia.Allergy)
                .WithMany(a => a.IngredientAllergies)
                .HasForeignKey(ia => ia.AllergyId)
                .OnDelete(DeleteBehavior.NoAction);


            // User ↔ Allergy (Many-to-Many)
            modelBuilder.Entity<UserAllergy>()
                .HasKey(ua => new { ua.UserId, ua.AllergyId });

            modelBuilder.Entity<UserAllergy>()
                .HasOne(ua => ua.Allergy)
                .WithMany(a => a.UserAllergies)
                .HasForeignKey(ua => ua.AllergyId)
                .OnDelete(DeleteBehavior.NoAction);
            // ================= SEED ALLERGY DATA =================

            modelBuilder.Entity<Allergy>().HasData(
                new Allergy { AllergyId = 1, Name = "Milk" },
                new Allergy { AllergyId = 2, Name = "Peanut" },
                new Allergy { AllergyId = 3, Name = "Gluten" },
                new Allergy { AllergyId = 4, Name = "Egg" },
                new Allergy { AllergyId = 5, Name = "Soy" },
                new Allergy { AllergyId = 6, Name = "Seafood" },
                new Allergy { AllergyId = 7, Name = "Nuts" }
            );

        }


    }
}
